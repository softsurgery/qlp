import { randomUUID } from 'crypto';
import { BeforeInsert, Column, PrimaryColumn } from 'typeorm';
import { Expose } from 'class-transformer';
import { EntityHelper } from '../interfaces/database.entity.interface';

export abstract class VersionedEntityHelper extends EntityHelper {
  @PrimaryColumn()
  @Expose()
  id: string;

  @PrimaryColumn()
  @Expose()
  version: number;

  @Column({ default: true })
  @Expose()
  isLatest: boolean;

  @BeforeInsert()
  assignIdAndVersion() {
    if (!this.id) {
      this.id = randomUUID();
    }
    if (this.version == null) {
      this.version = 1;
    }
    if (this.isLatest == null) {
      this.isLatest = true;
    }
  }
}
