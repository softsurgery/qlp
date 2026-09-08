import { Column, Entity, Index } from 'typeorm';
import { VersionedEntityHelper } from 'src/shared/database/entities/versioned-entity.helper';
import { CurriculumStatus } from '../enums/curriculum-status.enum';

@Entity('curricula')
export class CurriculumEntity extends VersionedEntityHelper {
  @Index()
  @Column()
  slug: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: CurriculumStatus, default: CurriculumStatus.Draft })
  status: CurriculumStatus;
}
