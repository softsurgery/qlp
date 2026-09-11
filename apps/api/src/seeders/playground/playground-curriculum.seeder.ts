import { Command } from 'nestjs-command';
import { Injectable } from '@nestjs/common';
import { CurriculumService } from 'src/modules/curriculum/services/curriculum.service';
import { CurriculumModuleService } from 'src/modules/curriculum/services/curriculum-module.service';
import { CurriculumLessonService } from 'src/modules/curriculum/services/curriculum-lesson.service';
import { CurriculumStatus } from 'src/modules/curriculum/enums/curriculum-status.enum';
import { CURRICULUMS, MODULE_NAMES, LESSON_NAMES } from '../data/curriculum.data';

@Injectable()
export class PlaygroundCurriculumSeedCommand {
  constructor(
    private readonly curriculumService: CurriculumService,
    private readonly moduleService: CurriculumModuleService,
    private readonly lessonService: CurriculumLessonService,
  ) {}

  @Command({
    command: 'seed:playground-curriculum',
    describe: 'seed 20 curriculums with actual defined data',
  })
  async seed() {
    const start = new Date();
    console.log('🚀 Starting seeding of curriculums with actual data...');

    for (let i = 0; i < CURRICULUMS.length; i++) {
      const curData = CURRICULUMS[i];
      const curriculum = await this.curriculumService.createCurriculum({
        title: curData.title,
        description: curData.description,
        status: CurriculumStatus.Published,
      });

      // 3 to 7 modules
      const numModules = 3 + (i % 5); // deterministic 3 to 7
      for (let j = 0; j < numModules; j++) {
        const moduleName = MODULE_NAMES[j % MODULE_NAMES.length];
        const module = await this.moduleService.createForCurriculum(curriculum.id, {
          title: `${moduleName} for ${curData.title}`,
          description: `Detailed exploration of ${moduleName.toLowerCase()}.`,
          sortOrder: j,
        });

        // 5 to 10 lessons
        const numLessons = 5 + (j % 6); // deterministic 5 to 10
        for (let k = 0; k < numLessons; k++) {
          const lessonName = LESSON_NAMES[k % LESSON_NAMES.length];
          await this.lessonService.createForModule(module.id, {
            title: `Lesson ${k + 1}: ${lessonName}`,
            description: `In this lesson, we will cover ${lessonName.toLowerCase()} in depth.`,
            sortOrder: k,
          });
        }
      }
      console.log(`✅ Created curriculum ${i + 1}/${CURRICULUMS.length}: ${curriculum.title}`);
    }

    const end = new Date();
    console.log(`✅ Seeding completed in ${end.getTime() - start.getTime()}ms ⏱️`);
  }
}
