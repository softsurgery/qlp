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

        const mappedRoleId =
          existsInSeedData.roleId === BasicRoles.Admin ? mappedRoles.admin : mappedRoles.user;

        await this.userService.save({
          ...existsInSeedData,
          roleId: mappedRoleId,
        });
        console.log(`✅ Created user: ${existsInSeedData.username}`);
      } else {
        console.log(`⚠️ User not found in seed data: ${userId}`);
      }
    };

    const adminRole = await this.roleService.findOneByLabel(BasicRoles.Admin);
    const userRole = await this.roleService.findOneByLabel(BasicRoles.User);

    if (!adminRole || !userRole) {
      console.log('⚠️ Roles not found! Please run the roles seeder first.');
      return;
    }

    const mappedRoles = { admin: adminRole.id, user: userRole.id };

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
