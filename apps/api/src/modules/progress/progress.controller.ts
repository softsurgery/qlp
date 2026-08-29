import { Controller, Get, Post, Param, Req, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ProgressService } from './progress.service';

@ApiTags('progress')
@ApiBearerAuth()
@Controller('progress')
export class ProgressController {
  constructor(private progressService: ProgressService) {}

  @Get('me')
  getMyProgress(@Req() req: any, @Query('userId') userId?: string) {
    const targetId = userId || req.user.id;
    return this.progressService.getUserProgress(targetId);
  }

  @Post('lessons/:lessonId/complete')
  completeLesson(@Req() req: any, @Param('lessonId') lessonId: string) {
    return this.progressService.completeLesson(req.user.id, lessonId);
  }

  @Get('lessons/:lessonId')
  getLessonProgress(@Req() req: any, @Param('lessonId') lessonId: string) {
    return this.progressService.getLessonProgress(req.user.id, lessonId);
  }
}
