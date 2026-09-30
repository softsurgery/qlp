import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { VersionedEntityHelper } from 'src/shared/database/entities/versioned-entity.helper';
import { CurriculumStatus } from '../enums/curriculum-status.enum';
import { AbstractUserEntity } from 'src/shared/abstract-user-management/entities/abstract-user.entity';
import { CurriculumModuleEntity } from './curriculum-module.entity';

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

  @Column({ nullable: true })
  ownerId?: string;

  @ManyToOne(() => AbstractUserEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'ownerId' })
  owner?: AbstractUserEntity;

  @Column({ nullable: true })
  createdById?: string;

  @ManyToOne(() => AbstractUserEntity, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'createdById' })
  createdBy?: AbstractUserEntity;

  @OneToMany(() => CurriculumModuleEntity, (module) => module.curriculum, {
    cascade: ['soft-remove', 'recover', 'remove'],
  })
  modules?: CurriculumModuleEntity[];
}
