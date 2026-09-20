import { Injectable } from '@nestjs/common';
import { AbstractWorkflowService } from 'src/shared/workflows/services/workflow.service';
import { CurriculumStatus } from '../enums/curriculum-status.enum';
import { CurriculumEvent } from '../enums/curriculum-event.enum';
import { curriculumLessonMachine } from '../workflows/curriculum-lesson.machine';
import { CurriculumLessonService } from './curriculum-lesson.service';

@Injectable()
export class CurriculumLessonWorkflowService extends AbstractWorkflowService<
  CurriculumStatus,
  CurriculumEvent
> {
  constructor(private readonly lessonService: CurriculumLessonService) {
    super(curriculumLessonMachine, CurriculumEvent);
  }

  async findOneById(id: string, join?: string) {
    const lessonEntity = await this.lessonService.findOneById(id, join);
    const machine = this.machine;
    return {
      status: lessonEntity.status,
      isUpdatable: this.isUpdatable(lessonEntity.status, machine),
      nextSteps: this.getNextSteps(lessonEntity.status, machine),
      lesson: lessonEntity,
    };
  }

  async next(id: string, event: CurriculumEvent) {
    const lessonEntity = await this.lessonService.findOneById(id);

    const newStatus = this.transition(lessonEntity.status, event, this.machine);

    await this.lessonService.updateCurrentVersion(id, { status: newStatus });

    return this.findOneById(id);
  }
}
