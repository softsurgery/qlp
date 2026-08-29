import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { CurriculumService } from './curriculum.service';
import { Public, Roles } from '../../common/auth/guards';
import { UserRole } from '@qlp/shared';

@ApiTags('curriculum')
@Controller('curriculum')
export class CurriculumController {
  constructor(private curriculumService: CurriculumService) {}

  @Public()
  @Get('tracks')
  getTracks() {
    return this.curriculumService.findPublishedTracks();
  }

  @Get('tracks/:slug')
  getTrack(@Param('slug') slug: string) {
    return this.curriculumService.findTrackBySlug(slug);
  }

  @Get('lessons/:id')
  getLesson(@Param('id') id: string) {
    return this.curriculumService.findLesson(id);
  }

  @Post('tracks')
  @Roles(UserRole.ADMIN)
  createTrack(@Body() body: any) {
    return this.curriculumService.createTrack(body);
  }

  @Post('units')
  @Roles(UserRole.ADMIN)
  createUnit(@Body() body: any) {
    return this.curriculumService.createUnit(body);
  }

  @Post('lessons')
  @Roles(UserRole.ADMIN)
  createLesson(@Body() body: any) {
    return this.curriculumService.createLesson(body);
  }

  @Patch('tracks/:id')
  @Roles(UserRole.ADMIN)
  updateTrack(@Param('id') id: string, @Body() body: any) {
    return this.curriculumService.updateTrack(id, body);
  }

  @Get('admin/tracks')
  @Roles(UserRole.ADMIN)
  adminTracks() {
    return this.curriculumService.findAllTracks();
  }
}
