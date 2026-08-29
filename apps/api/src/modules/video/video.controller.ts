import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { VideoService } from './video.service';

@ApiTags('video')
@ApiBearerAuth()
@Controller('video')
export class VideoController {
  constructor(private videoService: VideoService) {}

  @Post('room')
  createRoom(@Body() body: { bookingId: string }) {
    return this.videoService.createRoom(body.bookingId);
  }
}
