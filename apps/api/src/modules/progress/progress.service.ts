import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LessonProgress } from './entities/lesson-progress.entity';
import { AchievementService } from '../achievement/achievement.service';
import { CurriculumService } from '../curriculum/curriculum.service';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(LessonProgress)
    private progressRepo: Repository<LessonProgress>,
    private achievementService: AchievementService,
    private curriculumService: CurriculumService,
  ) {}

  async completeLesson(userId: string, lessonId: string) {
    let progress = await this.progressRepo.findOne({ where: { userId, lessonId } });
    if (!progress) {
      progress = this.progressRepo.create({ userId, lessonId, completed: true, completedAt: new Date() });
    } else {
      progress.completed = true;
      progress.completedAt = new Date();
    }
    await this.progressRepo.save(progress);

    const allProgress = await this.progressRepo.count({ where: { userId, completed: true } });
    await this.achievementService.checkAndAward(userId, 'lesson_complete', allProgress);
    await this.achievementService.updateStreak(userId);

    const lesson = await this.curriculumService.findLesson(lessonId);
    const track = await this.curriculumService.findTrackBySlug(lesson.unit.track.slug);
    const trackLessonIds = track.units.flatMap((u) => u.lessons.map((l) => l.id));
    const completedInTrack = await this.progressRepo
      .createQueryBuilder('p')
      .where('p.user_id = :userId', { userId })
      .andWhere('p.lesson_id IN (:...ids)', { ids: trackLessonIds })
      .andWhere('p.completed = true')
      .getCount();
    if (trackLessonIds.length > 0 && completedInTrack >= trackLessonIds.length) {
      await this.achievementService.checkAndAward(userId, 'track_complete', 1);
    }

    return progress;
  }

  async getUserProgress(userId: string) {
    const completed = await this.progressRepo.find({
      where: { userId, completed: true },
      relations: ['lesson', 'lesson.unit', 'lesson.unit.track'],
    });
    const total = await this.progressRepo.count({ where: { userId } });
    const completedCount = completed.length;
    return {
      completedCount,
      total,
      percentage: total > 0 ? Math.round((completedCount / total) * 100) : 0,
      lessons: completed,
    };
  }

  async getLessonProgress(userId: string, lessonId: string) {
    return this.progressRepo.findOne({ where: { userId, lessonId } });
  }
}
