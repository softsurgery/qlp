import { Controller, Get, Param, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CurriculumExamWorkflowService } from '../../services/curriculum-exam-workflow.service';
import { ResponseCurriculumExamWorkflowDto } from '../../dtos/exam/response-curriculum-exam-workflow.dto';
import { CurriculumEvent } from '../../enums/curriculum-event.enum';

@ApiTags('Admin Curriculum Exam Workflow')
@Controller('admin/curriculum/exams/:examId/workflow')
export class AdminCurriculumExamWorkflowController {
  constructor(private readonly workflowService: CurriculumExamWorkflowService) {}

  @Get()
  @ApiOperation({ summary: 'Get workflow state for an exam' })
  @ApiResponse({ status: 200, type: ResponseCurriculumExamWorkflowDto })
  async getWorkflow(@Param('examId') examId: string, @Query('join') join?: string) {
    return this.workflowService.findOneById(examId, join);
  }

  @Post()
  @ApiOperation({ summary: 'Execute a workflow event on an exam' })
  @ApiResponse({ status: 200, type: ResponseCurriculumExamWorkflowDto })
  async executeEvent(@Param('examId') examId: string, @Body('event') event: CurriculumEvent) {
    return this.workflowService.next(examId, event);
  }
}
