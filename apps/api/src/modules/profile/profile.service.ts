import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './entities/profile.entity';

@Injectable()
export class ProfileService {
  constructor(
    @InjectRepository(Profile)
    private profileRepo: Repository<Profile>,
  ) {}

  async createForUser(userId: string, displayName: string) {
    return this.profileRepo.save({ userId, displayName });
  }

  async findByUserId(userId: string) {
    return this.profileRepo.findOne({ where: { userId }, relations: ['user'] });
  }

  async update(userId: string, data: Partial<Profile>) {
    await this.profileRepo.update({ userId }, data);
    return this.findByUserId(userId);
  }
}
