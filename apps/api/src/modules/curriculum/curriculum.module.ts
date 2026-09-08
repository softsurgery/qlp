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
import { CurriculumService } from './services/curriculum.service';
import { CurriculumModuleService } from './services/curriculum-module.service';
import { CurriculumLessonService } from './services/curriculum-lesson.service';
import { CurriculumLessonMaterialService } from './services/curriculum-lesson-material.service';
import { CurriculumExamService } from './services/curriculum-exam.service';

@Module({
  providers: [
    CurriculumRepository,
    CurriculumModuleRepository,
    CurriculumLessonRepository,
    CurriculumLessonMaterialRepository,
    CurriculumExamRepository,
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
    TypeOrmModule.forFeature([
      CurriculumEntity,
      CurriculumModuleEntity,
      CurriculumLessonEntity,
      CurriculumLessonMaterialEntity,
      CurriculumExamEntity,
    ]),
  ],
})
export class CurriculumModule {}
