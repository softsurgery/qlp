import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { UserModule } from '../user/user.module';
import { TutorModule } from '../tutor/tutor.module';
import { CurriculumModule } from '../curriculum/curriculum.module';

@Module({
  imports: [UserModule, TutorModule, CurriculumModule],
  controllers: [AdminController],
})
export class AdminModule {}
