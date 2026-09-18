import { Command, Option } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { UserService } from 'src/modules/user-management/services/user.service';
import { mockUsersSeed } from '../data/playground-user.seeder';
import { RoleService } from 'src/shared/abstract-user-management/services/role.service';
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

        const mappedRoleId = mappedRoles[existsInSeedData.roleId] ?? mappedRoles[BasicRoles.User];

        await this.userService.save({
          ...existsInSeedData,
          roleId: mappedRoleId,
        });
        console.log(`✅ Created user: ${existsInSeedData.username}`);
      } else {
        console.log(`⚠️ User not found in seed data: ${userId}`);
      }
    };

    const mappedRoles: Record<string, string> = {};
    for (const basicRole of Object.values(BasicRoles)) {
      const role = await this.roleService.findOneByLabel(basicRole);
      if (role) mappedRoles[basicRole] = role.id;
    }

    const missing = Object.values(BasicRoles).filter((role) => !mappedRoles[role]);
    if (missing.length) {
      console.log(`⚠️ Roles not found (${missing.join(', ')})! Please run the roles seeder first.`);
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
