import { randomUUID } from 'crypto';
import { EntityHelper } from 'src/shared/database/interfaces/database.entity.interface';
import { BeforeInsert, Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { RolePermissionEntity } from './role-permission.entity';
import { AbstractUserEntity } from './abstract-user.entity';

@Entity('roles')
export class RoleEntity extends EntityHelper {
  @PrimaryColumn()
  id: string;

  @BeforeInsert()
  assignId() {
    if (!this.id) {
      this.id = randomUUID();
    }
  }

  @Column({ unique: true })
  label: string;

  @Column({ nullable: true })
  description?: string;

  @OneToMany(() => RolePermissionEntity, (rolePermission) => rolePermission.role)
  permissions: RolePermissionEntity[];

  @OneToMany(() => AbstractUserEntity, (user) => user.role)
  users: AbstractUserEntity[];
}
