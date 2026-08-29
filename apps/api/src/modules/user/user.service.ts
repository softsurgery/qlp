import { Injectable, ConflictException, NotFoundException, Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity';
import { UserRole } from '@qlp/shared';
import { ProfileService } from '../profile/profile.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    @Inject(forwardRef(() => ProfileService))
    private profileService: ProfileService,
  ) {}

  toPublic(user: User) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      avatarUrl: user.avatarUrl,
      isChild: user.isChild,
    };
  }

  async create(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: UserRole;
    isChild?: boolean;
    dateOfBirth?: string;
  }) {
    const existing = await this.userRepo.findOne({ where: { email: data.email } });
    if (existing) throw new ConflictException('Email already registered');

    const hashed = await bcrypt.hash(data.password, 10);
    const user = await this.userRepo.save({
      email: data.email,
      password: hashed,
      firstName: data.firstName,
      lastName: data.lastName,
      role: data.role || UserRole.STUDENT,
      isChild: data.isChild || false,
      dateOfBirth: data.dateOfBirth,
    });

    await this.profileService.createForUser(user.id, `${data.firstName} ${data.lastName}`);
    return user;
  }

  async findByEmail(email: string) {
    return this.userRepo
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();
  }

  async findById(id: string) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async findByIdWithRefresh(id: string) {
    return this.userRepo
      .createQueryBuilder('user')
      .addSelect('user.refreshToken')
      .where('user.id = :id', { id })
      .getOne();
  }

  async updateRefreshToken(id: string, refreshToken: string) {
    const hashed = await bcrypt.hash(refreshToken, 10);
    await this.userRepo.update(id, { refreshToken: hashed });
  }

  async findAll() {
    return this.userRepo.find({ order: { createdAt: 'DESC' } });
  }

  async update(id: string, data: Partial<User>) {
    await this.userRepo.update(id, data);
    return this.findById(id);
  }

  async setActive(id: string, isActive: boolean) {
    return this.update(id, { isActive });
  }
}
