import { Injectable } from '@nestjs/common';
import { AbstractWorkflowService } from 'src/shared/workflows/services/workflow.service';
import { CurriculumStatus } from '../enums/curriculum-status.enum';
import { CurriculumEvent } from '../enums/curriculum-event.enum';
import { curriculumMachine } from '../workflows/curriculum.machine';
import { CurriculumService } from './curriculum.service';

@Injectable()
export class CurriculumWorkflowService extends AbstractWorkflowService<
  CurriculumStatus,
  CurriculumEvent
> {
  constructor(private readonly curriculumService: CurriculumService) {
    super(curriculumMachine, CurriculumEvent);
  }

  async findOneById(id: string) {
    const curriculum = await this.curriculumService.findOneById(id);
    const machine = this.machine;
    return {
      status: curriculum.status,
      isUpdatable: this.isUpdatable(curriculum.status, machine),
      nextSteps: this.getNextSteps(curriculum.status, machine),
      curriculum,
    };
  }

  async next(id: string, event: CurriculumEvent) {
    const curriculum = await this.curriculumService.findOneById(id);

    const newStatus = this.transition(curriculum.status, event, this.machine);

    await this.curriculumService.update(id, { status: newStatus });

    return this.findOneById(id);
  }
}
