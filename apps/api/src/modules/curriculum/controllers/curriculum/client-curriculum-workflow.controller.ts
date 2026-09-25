import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Post,
  Request,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LogInterceptor } from 'src/shared/logger/decorators/logger.interceptor';
import { LogEvent } from 'src/shared/logger/decorators/log-event.decorator';
import { EventType } from 'src/app/enums/event-type.enum';
import { AdvancedRequest } from 'src/types';
import { toDto } from 'src/shared/database/utils/dtos';
import { CurriculumWorkflowService } from '../../services/curriculum-workflow.service';
import { ResponseCurriculumWorkflowDto } from '../../dtos/curriculum/response-curriculum-workflow.dto';
import { ExecuteCurriculumWorkflowDto } from '../../dtos/curriculum/execute-curriculum-workflow.dto';

@ApiTags('curriculum-workflow')
@ApiBearerAuth('access_token')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(LogInterceptor)
@Controller({ version: '1', path: '/curriculum/:id/workflow' })
export class ClientCurriculumWorkflowController {
  constructor(private readonly curriculumWorkflowService: CurriculumWorkflowService) {}

  @Get()
  async findWorkflow(
    @Param('id') id: string,
    @Query('join') join?: string,
  ): Promise<ResponseCurriculumWorkflowDto> {
    return toDto(
      ResponseCurriculumWorkflowDto,
      await this.curriculumWorkflowService.findOneById(id, join),
    );
  }

  @Post()
  @LogEvent(EventType.CURRICULUM_UPDATED)
  async executeWorkflow(
    @Param('id') id: string,
    @Body() dto: ExecuteCurriculumWorkflowDto,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseCurriculumWorkflowDto> {
    const result = await this.curriculumWorkflowService.next(id, dto.event);
    req.logInfo = { id, event: dto.event };
    return toDto(ResponseCurriculumWorkflowDto, result);
  }
}
