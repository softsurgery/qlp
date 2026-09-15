import { Controller, Get, Param, Post, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CurriculumLessonWorkflowService } from '../../services/curriculum-lesson-workflow.service';
import { ResponseCurriculumLessonWorkflowDto } from '../../dtos/lesson/response-curriculum-lesson-workflow.dto';
import { CurriculumEvent } from '../../enums/curriculum-event.enum';

@ApiTags('Admin Curriculum Lesson Workflow')
@Controller('admin/curriculum/lessons/:lessonId/workflow')
export class AdminCurriculumLessonWorkflowController {
  constructor(private readonly workflowService: CurriculumLessonWorkflowService) {}

  @Get()
  @ApiOperation({ summary: 'Get workflow state for a lesson' })
  @ApiResponse({ status: 200, type: ResponseCurriculumLessonWorkflowDto })
  async getWorkflow(@Param('lessonId') lessonId: string, @Query('join') join?: string) {
    return this.workflowService.findOneById(lessonId, join);
  }

  @Post()
  @ApiOperation({ summary: 'Execute a workflow event on a lesson' })
  @ApiResponse({ status: 200, type: ResponseCurriculumLessonWorkflowDto })
  async executeEvent(@Param('lessonId') lessonId: string, @Body('event') event: CurriculumEvent) {
    return this.workflowService.next(lessonId, event);
  }
}
