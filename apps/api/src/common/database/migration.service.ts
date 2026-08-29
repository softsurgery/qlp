import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { createHash } from 'crypto';
import { MigrationEntity } from './entities/migration.entity';

@Injectable()
export class MigrationService {
  private readonly logger = new Logger(MigrationService.name);

  constructor(
    @InjectRepository(MigrationEntity)
    private migrationRepo: Repository<MigrationEntity>,
  ) {}

  async runMigrations(migrationPath: string) {
    await this.migrationRepo.manager.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        version VARCHAR(50) NOT NULL UNIQUE,
        description VARCHAR(255),
        checksum VARCHAR(64) NOT NULL,
        executed_at TIMESTAMPTZ DEFAULT NOW()
      )
    `);

    const files = readdirSync(migrationPath)
      .filter((f) => f.endsWith('.sql'))
      .sort();

    for (const file of files) {
      const version = file.replace('.sql', '');
      const existing = await this.migrationRepo.findOne({ where: { version } });
      if (existing) continue;

      const content = readFileSync(join(migrationPath, file), 'utf-8');
      const checksum = createHash('sha256').update(content).digest('hex').slice(0, 16);

      this.logger.log(`Running migration: ${version}`);
      await this.migrationRepo.manager.query(content);
      await this.migrationRepo.save({ version, description: file, checksum });
      this.logger.log(`Migration ${version} completed`);
    }
  }
}
