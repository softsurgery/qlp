import { Module } from '@nestjs/common';
import { AuthModule } from 'src/shared/auth/auth.module';
import { ClientAuthController } from 'src/shared/auth/controllers/client-auth.controller';
import { LoggerModule } from 'src/shared/logger/logger.module';
import { NotificationModule } from 'src/shared/notifications/notifications.module';
import { StorageController } from 'src/shared/storage/controllers/storage.controller';
import { StorageModule } from 'src/shared/storage/storage.module';
import { CurriculumModule } from 'src/modules/curriculum/curriculum.module';
import { ClientCurriculumController } from 'src/modules/curriculum/controllers/client-curriculum.controller';
import { ClientCurriculumModuleController } from 'src/modules/curriculum/controllers/client-curriculum-module.controller';
import { ClientCurriculumLessonController } from 'src/modules/curriculum/controllers/client-curriculum-lesson.controller';
import { ClientCurriculumLessonMaterialController } from 'src/modules/curriculum/controllers/client-curriculum-lesson-material.controller';
import { ClientCurriculumExamController } from 'src/modules/curriculum/controllers/client-curriculum-exam.controller';

@Module({
  controllers: [
    ClientAuthController,
    StorageController,
    ClientCurriculumController,
    ClientCurriculumModuleController,
    ClientCurriculumLessonController,
    ClientCurriculumLessonMaterialController,
    ClientCurriculumExamController,
  ],
  providers: [],
  exports: [],
  imports: [AuthModule, NotificationModule, LoggerModule, StorageModule, CurriculumModule],
})
export class RoutesModule {}
