import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MigrationEntity } from './entities/migration.entity';
import { MigrationService } from './migration.service';
import { SeedService } from './seed.service';
import { User } from '../../modules/user/entities/user.entity';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([MigrationEntity, User])],
  providers: [MigrationService, SeedService],
  exports: [MigrationService, SeedService],
})
export class DatabaseModule {}
