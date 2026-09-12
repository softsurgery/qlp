import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CurriculumEntity } from './entities/curriculum.entity';
import { CurriculumModuleEntity } from './entities/curriculum-module.entity';
import { CurriculumLessonEntity } from './entities/curriculum-lesson.entity';
import { CurriculumLessonMaterialEntity } from './entities/curriculum-lesson-material.entity';
import { CurriculumExamEntity } from './entities/curriculum-exam.entity';
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
import { CurriculumCollaboratorEntity } from './entities/curriculum-collaborator.entity';
import { CurriculumModuleCollaboratorEntity } from './entities/curriculum-module-collaborator.entity';
import { CurriculumLessonCollaboratorEntity } from './entities/curriculum-lesson-collaborator.entity';
import { UserManagementModule } from '../user-management/user-management.module';

@Module({
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
  ],
  exports: [
    CurriculumService,
    CurriculumModuleService,
    CurriculumLessonService,
    CurriculumLessonMaterialService,
    CurriculumExamService,
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
  ],
})
export class CurriculumModule {}
