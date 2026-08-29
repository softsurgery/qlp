import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

@Entity('migrations')
export class MigrationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  version: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  checksum: string;

  @CreateDateColumn({ name: 'executed_at' })
  executedAt: Date;
}
