import { Module } from '@nestjs/common';
import { AuthModule } from 'src/shared/auth/auth.module';
import { ClientAuthController } from 'src/shared/auth/controllers/client-auth.controller';
import { LoggerModule } from 'src/shared/logger/logger.module';
import { NotificationModule } from 'src/shared/notifications/notifications.module';
import { StorageController } from 'src/shared/storage/controllers/storage.controller';
import { StorageModule } from 'src/shared/storage/storage.module';
import { CurriculumModule } from 'src/modules/curriculum/curriculum.module';
import { ClientCurriculumController } from 'src/modules/curriculum/controllers/curriculum/client-curriculum.controller';
import { ClientCurriculumWorkflowController } from 'src/modules/curriculum/controllers/curriculum/client-curriculum-workflow.controller';
import { ClientCurriculumModuleController } from 'src/modules/curriculum/controllers/curriculum-module/client-curriculum-module.controller';
import { ClientCurriculumLessonController } from 'src/modules/curriculum/controllers/curriculum-lesson/client-curriculum-lesson.controller';
import { ClientCurriculumLessonMaterialController } from 'src/modules/curriculum/controllers/curriculum-lesson/client-curriculum-lesson-material.controller';
import { ClientCurriculumExamController } from 'src/modules/curriculum/controllers/curriculum-exam/client-curriculum-exam.controller';
import { ClientCurriculumModuleWorkflowController } from 'src/modules/curriculum/controllers/curriculum-module/client-curriculum-module-workflow.controller';
import { ClientCurriculumLessonWorkflowController } from 'src/modules/curriculum/controllers/curriculum-lesson/client-curriculum-lesson-workflow.controller';
import { MediaModule } from 'src/modules/media/media.module';
import { ClientMediaController } from 'src/modules/media/controllers/client-media.controller';
import { MediaWebhookController } from 'src/modules/media/controllers/media-webhook.controller';
import { ClientMeetingController } from 'src/modules/media/controllers/client-meeting.controller';

@Module({
  controllers: [
    ClientAuthController,
    StorageController,
    ClientCurriculumController,
    ClientCurriculumWorkflowController,
    ClientCurriculumModuleController,
    ClientCurriculumModuleWorkflowController,
    ClientCurriculumLessonController,
    ClientCurriculumLessonWorkflowController,
    ClientCurriculumLessonMaterialController,
    ClientCurriculumExamController,
    ClientMediaController,
    MediaWebhookController,
    ClientMeetingController,
  ],
  providers: [],
  exports: [],
  imports: [
    AuthModule,
    NotificationModule,
    LoggerModule,
    StorageModule,
    CurriculumModule,
    MediaModule,
  ],
})
export class RoutesModule {}
