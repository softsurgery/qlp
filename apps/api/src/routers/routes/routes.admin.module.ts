import { Module } from '@nestjs/common';
import { AuthModule } from 'src/shared/auth/auth.module';
import { AuthController } from 'src/shared/auth/controllers/auth.controller';
import { LoggerModule } from 'src/shared/logger/logger.module';
import { NotificationModule } from 'src/shared/notifications/notifications.module';
import { UserManagementModule } from 'src/modules/user-management/user-management.module';
import { UserController } from 'src/modules/user-management/controllers/user.controller';
import { RoleController } from 'src/shared/abstract-user-management/controllers/role.controller';
import { PermissionController } from 'src/shared/abstract-user-management/controllers/permission.controller';

@Module({
  controllers: [AuthController, UserController, RoleController, PermissionController],
  providers: [],
  exports: [],
  imports: [AuthModule, NotificationModule, LoggerModule, UserManagementModule],
})
export class RoutesAdminModule {}
