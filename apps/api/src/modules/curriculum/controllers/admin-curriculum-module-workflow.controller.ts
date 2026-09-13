import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CurriculumModuleWorkflowService } from '../services/curriculum-module-workflow.service';
import { ResponseCurriculumModuleWorkflowDto } from '../dtos/module/response-curriculum-module-workflow.dto';
import { CurriculumEvent } from '../enums/curriculum-event.enum';

@ApiTags('Admin Curriculum Module Workflow')
@Controller('admin/curriculum/modules/:moduleId/workflow')
export class AdminCurriculumModuleWorkflowController {
  constructor(private readonly workflowService: CurriculumModuleWorkflowService) {}

  @Get()
  @ApiOperation({ summary: 'Get workflow state for a module' })
  @ApiResponse({ status: 200, type: ResponseCurriculumModuleWorkflowDto })
  async getWorkflow(@Param('moduleId') moduleId: string) {
    return this.workflowService.findOneById(moduleId);
  }

  @Post()
  @ApiOperation({ summary: 'Execute a workflow event on a module' })
  @ApiResponse({ status: 200, type: ResponseCurriculumModuleWorkflowDto })
  async executeEvent(@Param('moduleId') moduleId: string, @Body('event') event: CurriculumEvent) {
    return this.workflowService.next(moduleId, event);
  }
}
