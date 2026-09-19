import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurriculumEntity } from './entities/curriculum.entity';
import { CurriculumModuleEntity } from './entities/curriculum-module.entity';
import { CurriculumLessonEntity } from './entities/curriculum-lesson.entity';
import { CurriculumLessonMaterialEntity } from './entities/curriculum-lesson-material.entity';
import { CurriculumExamEntity } from './entities/curriculum-exam.entity';
import { CurriculumCollaboratorEntity } from './entities/curriculum-collaborator.entity';
import { CurriculumModuleCollaboratorEntity } from './entities/curriculum-module-collaborator.entity';
import { CurriculumLessonCollaboratorEntity } from './entities/curriculum-lesson-collaborator.entity';
import { CurriculumRepository } from './repositories/curriculum.repository';
import { CurriculumModuleRepository } from './repositories/curriculum-module.repository';
import { CurriculumLessonRepository } from './repositories/curriculum-lesson.repository';
import { CurriculumLessonMaterialRepository } from './repositories/curriculum-lesson-material.repository';
import { CurriculumExamRepository } from './repositories/curriculum-exam.repository';
import { CurriculumCollaboratorRepository } from './repositories/curriculum-collaborator.repository';
import { CurriculumModuleCollaboratorRepository } from './repositories/curriculum-module-collaborator.repository';
import { CurriculumLessonCollaboratorRepository } from './repositories/curriculum-lesson-collaborator.repository';
import { CurriculumService } from './services/curriculum.service';
import { CurriculumModuleService } from './services/curriculum-module.service';
import { CurriculumLessonService } from './services/curriculum-lesson.service';
import { CurriculumLessonMaterialService } from './services/curriculum-lesson-material.service';
import { CurriculumExamService } from './services/curriculum-exam.service';
import { CurriculumWorkflowService } from './services/curriculum-workflow.service';
import { CurriculumModuleWorkflowService } from './services/curriculum-module-workflow.service';
import { CurriculumLessonWorkflowService } from './services/curriculum-lesson-workflow.service';
import { CurriculumExamWorkflowService } from './services/curriculum-exam-workflow.service';
import { AdminCurriculumController } from './controllers/curriculum/admin-curriculum.controller';
import { AdminCurriculumModuleController } from './controllers/curriculum-module/admin-curriculum-module.controller';
import { AdminCurriculumWorkflowController } from './controllers/curriculum/admin-curriculum-workflow.controller';
import { AdminCurriculumModuleWorkflowController } from './controllers/curriculum-module/admin-curriculum-module-workflow.controller';
import { AdminCurriculumLessonWorkflowController } from './controllers/curriculum-lesson/admin-curriculum-lesson-workflow.controller';
import { AdminCurriculumExamWorkflowController } from './controllers/curriculum-exam/admin-curriculum-exam-workflow.controller';
import { ClientCurriculumWorkflowController } from './controllers/curriculum/client-curriculum-workflow.controller';
import { ClientCurriculumExamWorkflowController } from './controllers/curriculum-exam/client-curriculum-exam-workflow.controller';
import { UserManagementModule } from '../user-management/user-management.module';
import { LoggerModule } from 'src/shared/logger/logger.module';

@Module({
  controllers: [
    AdminCurriculumController,
    AdminCurriculumModuleController,
    AdminCurriculumWorkflowController,
    AdminCurriculumModuleWorkflowController,
    AdminCurriculumLessonWorkflowController,
    AdminCurriculumExamWorkflowController,
    ClientCurriculumWorkflowController,
    ClientCurriculumExamWorkflowController,
  ],
  providers: [
    CurriculumRepository,
    CurriculumModuleRepository,
    CurriculumLessonRepository,
    CurriculumLessonMaterialRepository,
    CurriculumExamRepository,
    CurriculumCollaboratorRepository,
    CurriculumModuleCollaboratorRepository,
    CurriculumLessonCollaboratorRepository,
    CurriculumService,
    CurriculumModuleService,
    CurriculumLessonService,
    CurriculumLessonMaterialService,
    CurriculumExamService,
    CurriculumWorkflowService,
    CurriculumModuleWorkflowService,
    CurriculumLessonWorkflowService,
    CurriculumExamWorkflowService,
  ],
  exports: [
    CurriculumRepository,
    CurriculumModuleRepository,
    CurriculumLessonRepository,
    CurriculumLessonMaterialRepository,
    CurriculumExamRepository,
    CurriculumCollaboratorRepository,
    CurriculumModuleCollaboratorRepository,
    CurriculumLessonCollaboratorRepository,
    CurriculumService,
    CurriculumModuleService,
    CurriculumLessonService,
    CurriculumLessonMaterialService,
    CurriculumExamService,
    CurriculumWorkflowService,
    CurriculumModuleWorkflowService,
    CurriculumLessonWorkflowService,
    CurriculumExamWorkflowService,
  ],

  imports: [
    UserManagementModule,
    TypeOrmModule.forFeature([
      CurriculumEntity,
      CurriculumModuleEntity,
      CurriculumLessonEntity,
      CurriculumLessonMaterialEntity,
      CurriculumExamEntity,
      CurriculumCollaboratorEntity,
      CurriculumModuleCollaboratorEntity,
      CurriculumLessonCollaboratorEntity,
    ]),
    LoggerModule,
  ],
})
export class CurriculumModule {}
