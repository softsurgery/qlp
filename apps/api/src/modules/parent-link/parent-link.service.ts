import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ParentChildLink } from './entities/parent-child-link.entity';
import { UserService } from '../user/user.service';
import { UserRole } from '@qlp/shared';
import { ProgressService } from '../progress/progress.service';
import { AchievementService } from '../achievement/achievement.service';

@Injectable()
export class ParentLinkService {
  constructor(
    @InjectRepository(ParentChildLink)
    private linkRepo: Repository<ParentChildLink>,
    private userService: UserService,
    private progressService: ProgressService,
    private achievementService: AchievementService,
  ) {}

  async createChild(parentId: string, data: { firstName: string; lastName: string; email: string; password: string; dateOfBirth?: string }) {
    const child = await this.userService.create({
      ...data,
      role: UserRole.STUDENT,
      isChild: true,
      dateOfBirth: data.dateOfBirth,
    });

    await this.linkRepo.save({ parentId, childId: child.id });
    return child;
  }

  async getChildren(parentId: string) {
    const links = await this.linkRepo.find({
      where: { parentId },
      relations: ['child'],
    });
    return links.map((l) => this.userService.toPublic(l.child));
  }

  async getChildProgress(parentId: string, childId: string) {
    await this.verifyParentChild(parentId, childId);
    const progress = await this.progressService.getUserProgress(childId);
    const achievements = await this.achievementService.getUserAchievements(childId);
    return { progress, achievements };
  }

  async verifyParentChild(parentId: string, childId: string) {
    const link = await this.linkRepo.findOne({ where: { parentId, childId } });
    if (!link) throw new ForbiddenException('Not authorized for this child');
    return link;
  }
}
