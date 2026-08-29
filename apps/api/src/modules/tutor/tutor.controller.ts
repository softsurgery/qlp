import { Controller, Get, Post, Patch, Body, Param, Query, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { TutorService } from './tutor.service';
import { Public, Roles } from '../../common/auth/guards';
import { UserRole, TutorStatus } from '@qlp/shared';

@ApiTags('tutors')
@Controller('tutors')
export class TutorController {
  constructor(private tutorService: TutorService) {}

  @Public()
  @Get()
  findAll(@Query('language') language?: string, @Query('specialty') specialty?: string) {
    return this.tutorService.findVerified({ language, specialty }).then((t) => t.map((x) => this.tutorService.toSummary(x)));
  }

  @Post('apply')
  @Roles(UserRole.STUDENT, UserRole.TUTOR)
  apply(@Req() req: any, @Body() body: any) {
    return this.tutorService.apply(req.user.id, body);
  }

  @Get('me/profile')
  @Roles(UserRole.TUTOR)
  myProfile(@Req() req: any) {
    return this.tutorService.findByUserId(req.user.id);
  }

  @Post('me/availability')
  @Roles(UserRole.TUTOR)
  setAvailability(@Req() req: any, @Body() body: { slots: any[] }) {
    return this.tutorService.findByUserId(req.user.id).then((t) =>
      this.tutorService.setAvailability(t!.id, body.slots),
    );
  }

  @Get('admin/pending')
  @Roles(UserRole.ADMIN)
  pending() {
    return this.tutorService.findPending();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tutorService.findById(id).then((t) => this.tutorService.toSummary(t));
  }

  @Patch(':id/verify')
  @Roles(UserRole.ADMIN)
  verify(@Param('id') id: string, @Body() body: { status: TutorStatus }) {
    return this.tutorService.verify(id, body.status);
  }
}
