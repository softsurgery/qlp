import { randomUUID } from 'crypto';
import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { CurriculumRepository } from 'src/modules/curriculum/repositories/curriculum.repository';
import { CurriculumModuleRepository } from 'src/modules/curriculum/repositories/curriculum-module.repository';
import { CurriculumLessonRepository } from 'src/modules/curriculum/repositories/curriculum-lesson.repository';
import { CurriculumExamRepository } from 'src/modules/curriculum/repositories/curriculum-exam.repository';
import { CurriculumLessonMaterialRepository } from 'src/modules/curriculum/repositories/curriculum-lesson-material.repository';
import { CurriculumStatus } from 'src/modules/curriculum/enums/curriculum-status.enum';
import { ExamQuestionType } from 'src/modules/curriculum/enums/exam-question-type.enum';
import { MaterialType } from 'src/modules/curriculum/enums/material-type.enum';
import { CURRICULUMS, MODULE_NAMES, LESSON_NAMES } from '../data/curriculum.data';
import { UserRepository } from 'src/modules/user-management/repositories/user.repository';
import { ExtendedRoles } from 'src/modules/user-management/enums/extended-roles.enum';
import { adminSeed } from '../data/admin.data';

@Injectable()
export class PlaygroundCurriculumSeedCommand {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly curriculumRepository: CurriculumRepository,
    private readonly moduleRepository: CurriculumModuleRepository,
    private readonly lessonRepository: CurriculumLessonRepository,
    private readonly examRepository: CurriculumExamRepository,
    private readonly materialRepository: CurriculumLessonMaterialRepository,
  ) {}

  @Command({
    command: 'seed:playground-curriculum',
    describe: 'seed curriculums owned by tutors and created by super admin',
  })
  async seed() {
    const start = new Date();
    console.log('🚀 Starting seeding of curriculums with actual data...');

    const superAdmin = await this.userRepository.findOne({
      where: { username: adminSeed.core.username },
    });
    if (!superAdmin) {
      console.log('⚠️ Super admin not found! Please run the admin seeder first.');
      return;
    }

    const tutors = await this.userRepository.findAll({
      where: { roleId: ExtendedRoles.Tutor },
    });
    if (!tutors.length) {
      console.log('⚠️ No tutors found! Please run the playground users seeder first.');
      return;
    }

    for (let i = 0; i < CURRICULUMS.length; i++) {
      const curData = CURRICULUMS[i];
      const owner = tutors[i % tutors.length];

      const curriculum = await this.curriculumRepository.save({
        title: curData.title,
        slug: this.slugify(curData.title),
        description: curData.description,
        status: CurriculumStatus.Published,
        ownerId: owner.id,
        createdById: superAdmin.id,
      });

      const numModules = 3 + (i % 5);
      for (let j = 0; j < numModules; j++) {
        const moduleName = MODULE_NAMES[j % MODULE_NAMES.length];
        const module = await this.moduleRepository.save({
          curriculumId: curriculum.id,
          title: `${moduleName} for ${curData.title}`,
          description: `Detailed exploration of ${moduleName.toLowerCase()}.`,
          sortOrder: j,
          status: CurriculumStatus.Published,
          ownerId: owner.id,
          createdById: superAdmin.id,
        });

        const numLessons = 5 + (j % 6);
        for (let k = 0; k < numLessons; k++) {
          const lessonName = LESSON_NAMES[k % LESSON_NAMES.length];
          const lesson = await this.lessonRepository.save({
            moduleId: module.id,
            title: `Lesson ${k + 1}: ${lessonName}`,
            description: `In this lesson, we will cover ${lessonName.toLowerCase()} in depth.`,
            sortOrder: k,
            status: CurriculumStatus.Published,
            createdById: superAdmin.id,
          });

          await this.materialRepository.save({
            lessonId: lesson.id,
            title: `${lessonName} notes`,
            description: `Supporting notes for ${lessonName.toLowerCase()}.`,
            type: MaterialType.Text,
            content: `Key takeaways from ${lessonName.toLowerCase()} in ${curData.title}.`,
            sortOrder: 0,
          });
        }

        await this.examRepository.save({
          moduleId: module.id,
          title: `${moduleName} Assessment`,
          description: `Check your understanding of ${moduleName.toLowerCase()}.`,
          durationMinutes: 30,
          passingScore: 70,
          sortOrder: 0,
          createdById: superAdmin.id,
          questions: [
            {
              id: randomUUID(),
              prompt: `What is the main focus of ${moduleName}?`,
              type: ExamQuestionType.ShortAnswer,
              answer: moduleName,
              points: 10,
            },
            {
              id: randomUUID(),
              prompt: `${moduleName} is an essential part of ${curData.title}.`,
              type: ExamQuestionType.TrueFalse,
              options: ['True', 'False'],
              answer: 'True',
              points: 5,
            },
            {
              id: randomUUID(),
              prompt: `Which topic belongs to ${moduleName}?`,
              type: ExamQuestionType.MultipleChoice,
              options: [moduleName, 'Unrelated topic', 'None of the above'],
              answer: moduleName,
              points: 10,
            },
          ],
        });
      }
      console.log(
        `✅ Created curriculum ${i + 1}/${CURRICULUMS.length}: ${curriculum.title} (owner: ${owner.username}, createdBy: ${superAdmin.username})`,
      );
    }

    const end = new Date();
    console.log(`✅ Seeding completed in ${end.getTime() - start.getTime()}ms ⏱️`);
  }

  private slugify(value: string) {
    const slug = value
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return slug || `curriculum-${Date.now()}`;
  }
}
