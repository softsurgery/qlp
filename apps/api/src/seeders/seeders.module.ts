import { Module } from '@nestjs/common';
import { CommandModule } from 'nestjs-command';
import { RolesSeedCommand } from './roles.seeder';
import { AdminSeedCommand } from './admin.seeder';
import { PermissionsSeedCommand } from './permission.seeder';
import { UserManagementModule } from 'src/modules/user-management/user-management.module';

@Module({
  providers: [
    //seeders
    PermissionsSeedCommand,
    RolesSeedCommand,
    AdminSeedCommand,
  ],
  imports: [CommandModule, UserManagementModule],
})
export class SeedersModule {}
