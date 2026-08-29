import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('parent_child_links')
export class ParentChildLink {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'parent_id' })
  parentId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'parent_id' })
  parent: User;

  @Column({ name: 'child_id' })
  childId: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'child_id' })
  child: User;

  @Column({ default: 'parent' })
  relationship: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
