import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ChatService } from './chat.service';

@ApiTags('chat')
@ApiBearerAuth()
@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get('conversations')
  getConversations(@Req() req: any) {
    return this.chatService.getConversations(req.user.id);
  }

  @Get('conversations/:id/messages')
  getMessages(@Req() req: any, @Param('id') id: string) {
    return this.chatService.getMessages(id, req.user.id);
  }

  @Post('conversations/:id/messages')
  sendMessage(@Req() req: any, @Param('id') id: string, @Body() body: { content: string }) {
    return this.chatService.sendMessage(id, req.user.id, body.content);
  }

  @Post('conversations')
  createConversation(@Req() req: any, @Body() body: { participantId: string; bookingId?: string }) {
    return this.chatService.getOrCreateConversation(req.user.id, body.participantId, body.bookingId);
  }
}
