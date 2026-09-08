import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { toDto, toDtoArray } from 'src/shared/database/utils/dtos';
import { LogInterceptor } from 'src/shared/logger/decorators/logger.interceptor';
import { LogEvent } from 'src/shared/logger/decorators/log-event.decorator';
import { EventType } from 'src/app/enums/event-type.enum';
import { AdvancedRequest } from 'src/types';
import { CurriculumLessonService } from '../services/curriculum-lesson.service';
import { CreateCurriculumLessonDto } from '../dtos/lesson/create-curriculum-lesson.dto';
import { UpdateCurriculumLessonDto } from '../dtos/lesson/update-curriculum-lesson.dto';
import { ResponseCurriculumLessonDto } from '../dtos/lesson/response-curriculum-lesson.dto';

@ApiTags('admin-curriculum-lesson')
@ApiBearerAuth('access_token')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(LogInterceptor)
@Controller({ version: '1', path: '/curriculum' })
export class AdminCurriculumLessonController {
  constructor(private readonly lessonService: CurriculumLessonService) {}

  @Get('/lessons/:lessonId/versions')
  async findVersions(@Param('lessonId') lessonId: string): Promise<ResponseCurriculumLessonDto[]> {
    return toDtoArray(ResponseCurriculumLessonDto, await this.lessonService.findAllVersions(lessonId));
  }

  @Post('/modules/:moduleId/lessons')
  @LogEvent(EventType.CURRICULUM_LESSON_CREATED)
  async create(
    @Param('moduleId') moduleId: string,
    @Body() dto: CreateCurriculumLessonDto,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseCurriculumLessonDto> {
    const lesson = await this.lessonService.createForModule(moduleId, dto);
    req.logInfo = { id: lesson.id, moduleId };
    return toDto(ResponseCurriculumLessonDto, lesson);
  }

  @Put('/lessons/:lessonId')
  @LogEvent(EventType.CURRICULUM_LESSON_UPDATED)
  async update(
    @Param('lessonId') lessonId: string,
    @Body() dto: UpdateCurriculumLessonDto,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseCurriculumLessonDto> {
    const lesson = await this.lessonService.updateLesson(lessonId, dto);
    req.logInfo = { id: lesson.id, version: lesson.version };
    return toDto(ResponseCurriculumLessonDto, lesson);
  }

  @Delete('/lessons/:lessonId')
  @LogEvent(EventType.CURRICULUM_LESSON_DELETED)
  async delete(
    @Param('lessonId') lessonId: string,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseCurriculumLessonDto | null> {
    req.logInfo = { id: lessonId };
    return toDto(ResponseCurriculumLessonDto, await this.lessonService.softDelete(lessonId));
  }
}
