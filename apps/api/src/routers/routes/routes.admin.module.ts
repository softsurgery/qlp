import { Module } from '@nestjs/common';
import { AuthModule } from 'src/shared/auth/auth.module';
import { AuthController } from 'src/shared/auth/controllers/auth.controller';
import { LoggerModule } from 'src/shared/logger/logger.module';
import { NotificationModule } from 'src/shared/notifications/notifications.module';
import { UserManagementModule } from 'src/modules/user-management/user-management.module';
import { UserController } from 'src/modules/user-management/controllers/user.controller';
import { RoleController } from 'src/shared/abstract-user-management/controllers/role.controller';
import { PermissionController } from 'src/shared/abstract-user-management/controllers/permission.controller';
import { CurriculumModule } from 'src/modules/curriculum/curriculum.module';
import { AdminCurriculumController } from 'src/modules/curriculum/controllers/admin-curriculum.controller';
import { AdminCurriculumModuleController } from 'src/modules/curriculum/controllers/admin-curriculum-module.controller';
import { AdminCurriculumLessonController } from 'src/modules/curriculum/controllers/admin-curriculum-lesson.controller';
import { AdminCurriculumLessonMaterialController } from 'src/modules/curriculum/controllers/admin-curriculum-lesson-material.controller';
import { AdminCurriculumExamController } from 'src/modules/curriculum/controllers/admin-curriculum-exam.controller';

@Module({
  controllers: [
    AuthController,
    UserController,
    RoleController,
    PermissionController,
    AdminCurriculumController,
    AdminCurriculumModuleController,
    AdminCurriculumLessonController,
    AdminCurriculumLessonMaterialController,
    AdminCurriculumExamController,
  ],
  providers: [],
  exports: [],
  imports: [AuthModule, NotificationModule, LoggerModule, UserManagementModule, CurriculumModule],
})
export class RoutesAdminModule {}
