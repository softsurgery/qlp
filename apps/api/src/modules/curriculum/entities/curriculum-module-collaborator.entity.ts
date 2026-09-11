import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import { AbstractUserEntity } from 'src/shared/abstract-user-management/entities/abstract-user.entity';
import { CollaboratorRole } from '../enums/collaborator-role.enum';

@Entity('curriculum_module_collaborators')
export class CurriculumModuleCollaboratorEntity extends EntityHelper {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index()
  @Column()
  moduleId: string;

  @Index()
  @Column()
  userId: string;

  @Column({ type: 'enum', enum: CollaboratorRole, default: CollaboratorRole.VIEWER })
  role: CollaboratorRole;

  @ManyToOne(() => AbstractUserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: AbstractUserEntity;
}
