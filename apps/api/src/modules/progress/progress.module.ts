import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LessonProgress } from './entities/lesson-progress.entity';
import { ProgressService } from './progress.service';
import { ProgressController } from './progress.controller';
import { AchievementModule } from '../achievement/achievement.module';
import { CurriculumModule } from '../curriculum/curriculum.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([LessonProgress]),
    AchievementModule,
    CurriculumModule,
  ],
  controllers: [ProgressController],
  providers: [ProgressService],
  exports: [ProgressService],
})
export class ProgressModule {}
