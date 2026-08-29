import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from '../../modules/user/entities/user.entity';
import { UserRole } from '@qlp/shared';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async seed() {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@qlp.local';
    const existing = await this.userRepo.findOne({ where: { email: adminEmail } });
    if (!existing) {
      const password = process.env.ADMIN_PASSWORD || 'Admin123!';
      const hashed = await bcrypt.hash(password, 10);
      await this.userRepo.save({
        email: adminEmail,
        password: hashed,
        firstName: 'Admin',
        lastName: 'User',
        role: UserRole.ADMIN,
      });
      this.logger.log(`Seeded admin user: ${adminEmail}`);
    }
  }
}
