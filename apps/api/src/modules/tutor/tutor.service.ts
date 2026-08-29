import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TutorProfile } from './entities/tutor-profile.entity';
import { TutorAvailability } from './entities/tutor-availability.entity';
import { TutorStatus, UserRole } from '@qlp/shared';
import { UserService } from '../user/user.service';

@Injectable()
export class TutorService {
  constructor(
    @InjectRepository(TutorProfile) private tutorRepo: Repository<TutorProfile>,
    @InjectRepository(TutorAvailability) private availRepo: Repository<TutorAvailability>,
    private userService: UserService,
  ) {}

  async apply(userId: string, data: Partial<TutorProfile>) {
    const existing = await this.tutorRepo.findOne({ where: { userId } });
    if (existing) throw new ConflictException('Tutor profile already exists');

    await this.userService.update(userId, { role: UserRole.TUTOR });
    return this.tutorRepo.save({ userId, ...data, status: TutorStatus.PENDING });
  }

  async findVerified(filters?: { language?: string; specialty?: string }) {
    const qb = this.tutorRepo
      .createQueryBuilder('tutor')
      .leftJoinAndSelect('tutor.user', 'user')
      .where('tutor.status = :status', { status: TutorStatus.VERIFIED });

    if (filters?.language) {
      qb.andWhere(':lang = ANY(tutor.languages)', { lang: filters.language });
    }
    if (filters?.specialty) {
      qb.andWhere(':spec = ANY(tutor.specialties)', { spec: filters.specialty });
    }

    return qb.getMany();
  }

  async findById(id: string) {
    const tutor = await this.tutorRepo.findOne({
      where: { id },
      relations: ['user', 'availability'],
    });
    if (!tutor) throw new NotFoundException('Tutor not found');
    return tutor;
  }

  async findByUserId(userId: string) {
    return this.tutorRepo.findOne({ where: { userId }, relations: ['availability'] });
  }

  async verify(id: string, status: TutorStatus) {
    await this.tutorRepo.update(id, { status });
    return this.findById(id);
  }

  async setAvailability(tutorId: string, slots: Partial<TutorAvailability>[]) {
    await this.availRepo.delete({ tutorId });
    return this.availRepo.save(slots.map((s) => ({ ...s, tutorId })));
  }

  async findPending() {
    return this.tutorRepo.find({ where: { status: TutorStatus.PENDING }, relations: ['user'] });
  }

  toSummary(tutor: TutorProfile) {
    return {
      id: tutor.id,
      userId: tutor.userId,
      displayName: tutor.user ? `${tutor.user.firstName} ${tutor.user.lastName}` : '',
      bio: tutor.bio,
      languages: tutor.languages,
      specialties: tutor.specialties,
      status: tutor.status,
      avatarUrl: tutor.user?.avatarUrl,
      rating: Number(tutor.rating),
      hourlyRate: tutor.hourlyRate,
    };
  }
}
