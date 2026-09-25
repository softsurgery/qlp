import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { toDto, toDtoArray } from 'src/shared/database/utils/dtos';
import { LogInterceptor } from 'src/shared/logger/decorators/logger.interceptor';
import { LogEvent } from 'src/shared/logger/decorators/log-event.decorator';
import { EventType } from 'src/app/enums/event-type.enum';
import { AdvancedRequest } from 'src/types';
import { CurriculumExamService } from '../../services/curriculum-exam.service';
import { CreateCurriculumExamDto } from '../../dtos/exam/create-curriculum-exam.dto';
import { UpdateCurriculumExamDto } from '../../dtos/exam/update-curriculum-exam.dto';
import { ResponseCurriculumExamDto } from '../../dtos/exam/response-curriculum-exam.dto';

@ApiTags('admin-curriculum-exam')
@ApiBearerAuth('access_token')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(LogInterceptor)
@Controller({ version: '1', path: '/curriculum' })
export class AdminCurriculumExamController {
  constructor(private readonly examService: CurriculumExamService) {}

  @Get('/modules/:moduleId/exams')
  async findByModule(
    @Param('moduleId') moduleId: string,
    @Query('join') join?: string,
  ): Promise<ResponseCurriculumExamDto[]> {
    return toDtoArray(
      ResponseCurriculumExamDto,
      await this.examService.findLatestByModule(moduleId, join),
    );
  }

  @Get('/exams/:examId/versions')
  async findVersions(
    @Param('examId') examId: string,
    @Query('join') join?: string,
  ): Promise<ResponseCurriculumExamDto[]> {
    return toDtoArray(ResponseCurriculumExamDto, await this.examService.findVersions(examId, join));
  }

  @Post('/modules/:moduleId/exams')
  @LogEvent(EventType.CURRICULUM_EXAM_CREATED)
  async create(
    @Param('moduleId') moduleId: string,
    @Body() dto: CreateCurriculumExamDto,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseCurriculumExamDto> {
    if (!req.user?.sub) {
      throw new UnauthorizedException();
    }
    const exam = await this.examService.createForModule(moduleId, dto, req.user.sub);
    req.logInfo = { id: exam.id, moduleId };
    return toDto(ResponseCurriculumExamDto, exam);
  }

  @Put('/exams/reorder')
  async reorder(@Body() dto: { updates: { id: string; sortOrder: number }[] }) {
    return this.examService.reorderExams(dto.updates);
  }

  @Put('/exams/:examId')
  @LogEvent(EventType.CURRICULUM_EXAM_UPDATED)
  async update(
    @Param('examId') examId: string,
    @Body() dto: UpdateCurriculumExamDto,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseCurriculumExamDto> {
    const exam = await this.examService.updateExam(examId, dto);
    req.logInfo = { id: exam.id, version: exam.version };
    return toDto(ResponseCurriculumExamDto, exam);
  }

  @Delete('/exams/:examId')
  @LogEvent(EventType.CURRICULUM_EXAM_DELETED)
  async delete(
    @Param('examId') examId: string,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseCurriculumExamDto | null> {
    req.logInfo = { id: examId };
    return toDto(ResponseCurriculumExamDto, await this.examService.softDelete(examId));
  }
}
