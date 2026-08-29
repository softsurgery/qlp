import { Controller, Get, Patch, Param, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from '../user/user.service';
import { TutorService } from '../tutor/tutor.service';
import { CurriculumService } from '../curriculum/curriculum.service';
import { Roles } from '../../common/auth/guards';
import { UserRole, TutorStatus } from '@qlp/shared';

@ApiTags('admin')
@ApiBearerAuth()
@Roles(UserRole.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(
    private userService: UserService,
    private tutorService: TutorService,
    private curriculumService: CurriculumService,
  ) {}

  @Get('users')
  getUsers() {
    return this.userService.findAll().then((users) =>
      users.map((u) => this.userService.toPublic(u)),
    );
  }

  @Patch('users/:id/active')
  setActive(@Param('id') id: string, @Body() body: { isActive: boolean }) {
    return this.userService.setActive(id, body.isActive);
  }

  @Get('tutors/pending')
  pendingTutors() {
    return this.tutorService.findPending();
  }

  @Patch('tutors/:id/verify')
  verifyTutor(@Param('id') id: string, @Body() body: { status: TutorStatus }) {
    return this.tutorService.verify(id, body.status);
  }

  @Get('curriculum')
  getCurriculum() {
    return this.curriculumService.findAllTracks();
  }
}
