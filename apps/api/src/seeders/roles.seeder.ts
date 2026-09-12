import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { RoleRepository } from 'src/shared/abstract-user-management/repositories/role.repository';
import { RolePermissionRepository } from 'src/shared/abstract-user-management/repositories/role-permission.repository';
import { PermissionRepository } from 'src/shared/abstract-user-management/repositories/permission.repository';
import { BasicRoles } from 'src/shared/abstract-user-management/enums/basic-roles.enum';
import { ExtendedRoles } from 'src/modules/user-management/enums/extended-roles.enum';

@Injectable()
export class RolesSeedCommand {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly permissionRepository: PermissionRepository,
    private readonly rolePermissionRepository: RolePermissionRepository,
  ) {}

  @Command({
    command: 'seed:roles',
    describe: 'seed system roles',
  })
  async seed() {
    const start = new Date();
    console.log('🚀 Starting seeding of roles...');
    //=============================================================================================
    const permissions = await this.permissionRepository.findAll();

    await this.roleRepository.saveMany([
      {
        id: BasicRoles.Admin,
        label: BasicRoles.Admin,
        description: `${BasicRoles.Admin} role`,
      },
      {
        id: BasicRoles.User,
        label: BasicRoles.User,
        description: `${BasicRoles.User} role`,
      },
      {
        id: ExtendedRoles.Tutor,
        label: ExtendedRoles.Tutor,
        description: `${ExtendedRoles.Tutor} role`,
      },
      {
        id: ExtendedRoles.Student,
        label: ExtendedRoles.Student,
        description: `${ExtendedRoles.Student} role`,
      },
      {
        id: ExtendedRoles.Kid,
        label: ExtendedRoles.Kid,
        description: `${ExtendedRoles.Kid} role`,
      },
      {
        id: ExtendedRoles.Parent,
        label: ExtendedRoles.Parent,
        description: `${ExtendedRoles.Parent} role`,
      },
    ]);

    const existings = await this.rolePermissionRepository.findAll({
      where: { roleId: BasicRoles.Admin },
    });

    await this.rolePermissionRepository.deleteMany(existings.map((e) => e.id));

    await this.rolePermissionRepository.saveMany(
      permissions.map((p) => ({
        roleId: BasicRoles.Admin,
        permissionId: p.id,
      })),
    );

    //=============================================================================================
    const end = new Date();
    console.log(`✅ Seeding completed in ${end.getTime() - start.getTime()}ms ⏱️`);
  }
}
