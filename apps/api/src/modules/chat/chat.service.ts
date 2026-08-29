import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { MessageType } from '@qlp/shared';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Conversation) private convRepo: Repository<Conversation>,
    @InjectRepository(Message) private msgRepo: Repository<Message>,
  ) {}

  private orderParticipants(a: string, b: string): [string, string] {
    return a < b ? [a, b] : [b, a];
  }

  async getOrCreateConversation(userA: string, userB: string, bookingId?: string) {
    const [participantAId, participantBId] = this.orderParticipants(userA, userB);
    let conv = await this.convRepo.findOne({ where: { participantAId, participantBId } });
    if (!conv) {
      conv = await this.convRepo.save({ participantAId, participantBId, bookingId });
    }
    return conv;
  }

  async getConversations(userId: string) {
    const convs = await this.convRepo
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.participantA', 'a')
      .leftJoinAndSelect('c.participantB', 'b')
      .where('c.participant_a_id = :userId OR c.participant_b_id = :userId', { userId })
      .orderBy('c.updated_at', 'DESC')
      .getMany();

    return Promise.all(
      convs.map(async (c) => {
        const other = c.participantAId === userId ? c.participantB : c.participantA;
        const lastMsg = await this.msgRepo.findOne({
          where: { conversationId: c.id },
          order: { createdAt: 'DESC' },
        });
        const unread = await this.msgRepo.count({
          where: { conversationId: c.id, readAt: null as any },
        });
        return {
          id: c.id,
          participantId: other.id,
          participantName: `${other.firstName} ${other.lastName}`,
          lastMessage: lastMsg?.content,
          lastMessageAt: lastMsg?.createdAt,
          unreadCount: unread,
        };
      }),
    );
  }

  async getMessages(conversationId: string, userId: string) {
    const conv = await this.convRepo.findOne({ where: { id: conversationId } });
    if (!conv) throw new NotFoundException('Conversation not found');
    if (conv.participantAId !== userId && conv.participantBId !== userId) {
      throw new ForbiddenException('Not a participant');
    }

    await this.msgRepo
      .createQueryBuilder()
      .update(Message)
      .set({ readAt: new Date() })
      .where('conversation_id = :conversationId', { conversationId })
      .andWhere('sender_id != :userId', { userId })
      .andWhere('read_at IS NULL')
      .execute();

    return this.msgRepo.find({
      where: { conversationId },
      relations: ['sender'],
      order: { createdAt: 'ASC' },
    });
  }

  async sendMessage(conversationId: string, senderId: string, content: string, messageType = MessageType.TEXT) {
    const conv = await this.convRepo.findOne({ where: { id: conversationId } });
    if (!conv) throw new NotFoundException('Conversation not found');
    if (conv.participantAId !== senderId && conv.participantBId !== senderId) {
      throw new ForbiddenException('Not a participant');
    }

    const message = await this.msgRepo.save({
      conversationId,
      senderId,
      content,
      messageType,
    });
    await this.convRepo.update(conversationId, { updatedAt: new Date() });
    return this.msgRepo.findOne({ where: { id: message.id }, relations: ['sender'] });
  }
}
