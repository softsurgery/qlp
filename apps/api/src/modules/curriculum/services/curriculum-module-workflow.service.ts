import { Injectable } from '@nestjs/common';
import { AbstractWorkflowService } from 'src/shared/workflows/services/workflow.service';
import { CurriculumStatus } from '../enums/curriculum-status.enum';
import { CurriculumEvent } from '../enums/curriculum-event.enum';
import { curriculumModuleMachine } from '../workflows/curriculum-module.machine';
import { CurriculumModuleService } from './curriculum-module.service';

@Injectable()
export class CurriculumModuleWorkflowService extends AbstractWorkflowService<
  CurriculumStatus,
  CurriculumEvent
> {
  constructor(private readonly moduleService: CurriculumModuleService) {
    super(curriculumModuleMachine, CurriculumEvent);
  }

  async findOneById(id: string, join?: string) {
    const moduleEntity = await this.moduleService.findOneById(id, join);
    const machine = this.machine;
    return {
      status: moduleEntity.status,
      isUpdatable: this.isUpdatable(moduleEntity.status, machine),
      nextSteps: this.getNextSteps(moduleEntity.status, machine),
      module: moduleEntity,
    };
  }

  async next(id: string, event: CurriculumEvent) {
    const moduleEntity = await this.moduleService.findOneById(id);

    const newStatus = this.transition(moduleEntity.status, event, this.machine);

    await this.moduleService.updateCurrentVersion(id, { status: newStatus });

    return this.findOneById(id);
  }
}
