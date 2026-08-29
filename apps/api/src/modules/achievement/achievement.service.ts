import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Achievement } from './entities/achievement.entity';
import { UserAchievement } from './entities/user-achievement.entity';
import { Streak } from './entities/streak.entity';

@Injectable()
export class AchievementService {
  constructor(
    @InjectRepository(Achievement) private achievementRepo: Repository<Achievement>,
    @InjectRepository(UserAchievement) private userAchievementRepo: Repository<UserAchievement>,
    @InjectRepository(Streak) private streakRepo: Repository<Streak>,
  ) {}

  async checkAndAward(userId: string, triggerEvent: string, currentCount: number) {
    const achievements = await this.achievementRepo.find({ where: { triggerEvent } });
    const awarded: Achievement[] = [];

    for (const achievement of achievements) {
      if (currentCount >= achievement.triggerThreshold) {
        const existing = await this.userAchievementRepo.findOne({
          where: { userId, achievementId: achievement.id },
        });
        if (!existing) {
          await this.userAchievementRepo.save({ userId, achievementId: achievement.id });
          awarded.push(achievement);
        }
      }
    }
    return awarded;
  }

  async updateStreak(userId: string) {
    const today = new Date().toISOString().split('T')[0];
    let streak = await this.streakRepo.findOne({ where: { userId } });

    if (!streak) {
      streak = await this.streakRepo.save({
        userId,
        currentStreak: 1,
        longestStreak: 1,
        lastActivityDate: today,
      });
    } else if (streak.lastActivityDate === today) {
      return streak;
    } else {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      if (streak.lastActivityDate === yesterdayStr) {
        streak.currentStreak += 1;
      } else {
        streak.currentStreak = 1;
      }
      streak.longestStreak = Math.max(streak.longestStreak, streak.currentStreak);
      streak.lastActivityDate = today;
      await this.streakRepo.save(streak);
    }

    await this.checkAndAward(userId, 'streak_days', streak.currentStreak);
    return streak;
  }

  async getUserAchievements(userId: string) {
    const earned = await this.userAchievementRepo.find({
      where: { userId },
      relations: ['achievement'],
      order: { earnedAt: 'DESC' },
    });
    const all = await this.achievementRepo.find();
    const streak = await this.streakRepo.findOne({ where: { userId } });

    return {
      earned: earned.map((e) => ({
        ...e.achievement,
        earnedAt: e.earnedAt,
      })),
      available: all.filter((a) => !earned.find((e) => e.achievementId === a.id)),
      streak: streak || { currentStreak: 0, longestStreak: 0 },
    };
  }

  async findAll() {
    return this.achievementRepo.find();
  }
}
