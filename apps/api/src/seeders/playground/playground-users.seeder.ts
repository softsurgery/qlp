import { Command, Option } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { UserService } from 'src/modules/user-management/services/user.service';
import { mockUsersSeed } from '../data/playground-user.seeder';
import { RoleService } from 'src/shared/abstract-user-management/services/role.service';
import { ExtendedRoles } from 'src/modules/user-management/enums/extended-roles.enum';
import { BasicRoles } from 'src/shared/abstract-user-management/enums/basic-roles.enum';

@Injectable()
export class PlaygroundUsersSeedCommand {
  constructor(
    private readonly userService: UserService,
    private readonly roleService: RoleService,
  ) {}

  @Command({
    command: 'seed:playground-users',
    describe: 'seed playground users',
  })
  async seed(
    @Option({
      name: 'userId',
      describe: 'Seed a specific user by ID',
      type: 'string',
      required: false,
    })
    userId?: string,
  ) {
    const start = new Date();
    console.log('🚀 Starting seeding of playground users...');
    //=============================================================================================

    const seedUser = async (userId: string, mappedRoles: Record<string, string>) => {
      const existsInSeedData = mockUsersSeed.find((u) => u.id === userId);
      if (existsInSeedData) {
        const exists = await this.userService.findOneByCondition({
          filter: `id||$eq||${userId}`,
        });
        if (exists) {
          console.log(`⚠️ User already exists: ${existsInSeedData.username}`);
          return;
        }

        const mappedRoleId = mappedRoles[existsInSeedData.roleId];
        if (!mappedRoleId) {
          console.log(
            `⚠️ Role not found for user ${existsInSeedData.username}: ${existsInSeedData.roleId}`,
          );
          return;
        }

        await this.userService.save({
          ...existsInSeedData,
          roleId: mappedRoleId,
        });
        console.log(`✅ Created user: ${existsInSeedData.username}`);
      } else {
        console.log(`⚠️ User not found in seed data: ${userId}`);
      }
    };

    const roles = await this.roleService.findAll();
    const mappedRoles = Object.fromEntries(roles.map((role) => [role.label, role.id]));

    if (
      !mappedRoles[BasicRoles.Admin] ||
      !mappedRoles[BasicRoles.User] ||
      !mappedRoles[ExtendedRoles.Tutor]
    ) {
      console.log('⚠️ Roles not found! Please run the roles seeder first.');
      return;
    }

    if (!userId) {
      for (const user of mockUsersSeed) {
        await seedUser(user.id, mappedRoles);
      }
    } else {
      await seedUser(userId, mappedRoles);
    }

    //=============================================================================================
    const end = new Date();
    console.log(`✅ Seeding completed in ${end.getTime() - start.getTime()}ms ⏱️`);
  }
}
