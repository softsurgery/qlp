import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { RolesSeedCommand } from './roles.seeder';
import { AdminSeedCommand } from './admin.seeder';
import { PermissionsSeedCommand } from './permission.seeder';
import { UserManagementModule } from 'src/modules/user-management/user-management.module';
import { PlaygroundUsersSeedCommand } from './playground/playground-users.seeder';
import { PlaygroundCurriculumSeedCommand } from './playground/playground-curriculum.seeder';
import { CurriculumModule } from 'src/modules/curriculum/curriculum.module';

@Module({
  providers: [
    //seeders
    PermissionsSeedCommand,
    RolesSeedCommand,
    AdminSeedCommand,
    PlaygroundUsersSeedCommand,
    PlaygroundCurriculumSeedCommand,
  ],
  imports: [CommandModule, UserManagementModule, CurriculumModule],
})
export class SeedersModule {}
