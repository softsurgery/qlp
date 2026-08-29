import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { BookingStatus } from '@qlp/shared';
import { TutorService } from '../tutor/tutor.service';
import { VideoService } from '../video/video.service';
import { AchievementService } from '../achievement/achievement.service';
import { ChatService } from '../chat/chat.service';

@Injectable()
export class BookingService {
  constructor(
    @InjectRepository(Booking) private bookingRepo: Repository<Booking>,
    private tutorService: TutorService,
    private videoService: VideoService,
    private achievementService: AchievementService,
    private chatService: ChatService,
  ) {}

  async create(studentId: string, data: { tutorId: string; startTime: string; endTime: string; notes?: string }) {
    const tutor = await this.tutorService.findById(data.tutorId);
    if (tutor.status !== 'verified') throw new BadRequestException('Tutor not verified');

    const booking = await this.bookingRepo.save({
      tutorId: data.tutorId,
      studentId,
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
      notes: data.notes,
      status: BookingStatus.REQUESTED,
    });

    await this.chatService.getOrCreateConversation(studentId, tutor.userId, booking.id);
    return booking;
  }

  async confirm(id: string, tutorUserId: string) {
    const booking = await this.findById(id);
    if (booking.tutor.userId !== tutorUserId) throw new BadRequestException('Not your booking');
    booking.status = BookingStatus.CONFIRMED;
    return this.bookingRepo.save(booking);
  }

  async cancel(id: string, userId: string) {
    const booking = await this.findById(id);
    if (booking.studentId !== userId && booking.tutor.userId !== userId) {
      throw new BadRequestException('Not authorized');
    }
    booking.status = BookingStatus.CANCELLED;
    return this.bookingRepo.save(booking);
  }

  async startSession(id: string, userId: string) {
    const booking = await this.findById(id);
    const room = await this.videoService.createRoom(booking.id);
    booking.status = BookingStatus.IN_PROGRESS;
    booking.videoRoomUrl = room.livekitUrl;
    booking.videoRoomName = room.roomName;
    return this.bookingRepo.save(booking);
  }

  async completeSession(id: string) {
    const booking = await this.findById(id);
    booking.status = BookingStatus.COMPLETED;
    await this.bookingRepo.save(booking);

    const completed = await this.bookingRepo.count({
      where: { studentId: booking.studentId, status: BookingStatus.COMPLETED },
    });
    await this.achievementService.checkAndAward(booking.studentId, 'session_complete', completed);
    return booking;
  }

  async findById(id: string) {
    const booking = await this.bookingRepo.findOne({
      where: { id },
      relations: ['tutor', 'tutor.user', 'student'],
    });
    if (!booking) throw new NotFoundException('Booking not found');
    return booking;
  }

  async findForUser(userId: string, role: string) {
    if (role === 'tutor') {
      const tutor = await this.tutorService.findByUserId(userId);
      if (!tutor) return [];
      return this.bookingRepo.find({
        where: { tutorId: tutor.id },
        relations: ['student', 'tutor', 'tutor.user'],
        order: { startTime: 'ASC' },
      });
    }
    return this.bookingRepo.find({
      where: { studentId: userId },
      relations: ['tutor', 'tutor.user', 'student'],
      order: { startTime: 'ASC' },
    });
  }
}
