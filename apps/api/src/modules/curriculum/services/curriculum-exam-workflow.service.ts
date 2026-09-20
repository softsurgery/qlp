import { Injectable } from '@nestjs/common';
import { AbstractWorkflowService } from 'src/shared/workflows/services/workflow.service';
import { CurriculumStatus } from '../enums/curriculum-status.enum';
import { CurriculumEvent } from '../enums/curriculum-event.enum';
import { curriculumExamMachine } from '../workflows/curriculum-exam.machine';
import { CurriculumExamService } from './curriculum-exam.service';

@Injectable()
export class CurriculumExamWorkflowService extends AbstractWorkflowService<
  CurriculumStatus,
  CurriculumEvent
> {
  constructor(private readonly examService: CurriculumExamService) {
    super(curriculumExamMachine, CurriculumEvent);
  }

  async findOneById(id: string, join?: string) {
    const examEntity = await this.examService.findOneById(id, join);
    const machine = this.machine;
    return {
      status: examEntity.status,
      isUpdatable: this.isUpdatable(examEntity.status, machine),
      nextSteps: this.getNextSteps(examEntity.status, machine),
      exam: examEntity,
    };
  }

  async next(id: string, event: CurriculumEvent) {
    const examEntity = await this.examService.findOneById(id);

    const newStatus = this.transition(examEntity.status, event, this.machine);

    await this.examService.updateCurrentVersion(id, { status: newStatus });

    return this.findOneById(id);
  }
}
