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
    return toDtoArray(
      ResponseCurriculumLessonDto,
      await this.lessonService.findAllVersions(lessonId),
    );
  }

  @Post('/modules/:moduleId/lessons')
  @LogEvent(EventType.CURRICULUM_LESSON_CREATED)
  async create(
    @Param('moduleId') moduleId: string,
    @Body() dto: CreateCurriculumLessonDto,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseCurriculumLessonDto> {
    if (!dto.ownerId && req.user?.sub) {
      dto.ownerId = req.user.sub;
    }
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
    const lesson = await this.lessonService.updateLesson(lessonId, dto, req.user?.sub);
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
    return toDto(
      ResponseCurriculumLessonDto,
      await this.lessonService.softDelete(lessonId, req.user?.sub),
    );
  }

  @Put('/lessons/:lessonId/collaborators')
  async addOrUpdateCollaborator(
    @Param('lessonId') lessonId: string,
    @Body() dto: import('../dtos/collaborator/update-collaborator.dto').UpdateCollaboratorDto,
    @Request() req: AdvancedRequest,
  ) {
    return this.lessonService.addOrUpdateCollaborator(
      lessonId,
      dto.userId,
      dto.role,
      req.user?.sub,
    );
  }

  @Delete('/lessons/:lessonId/collaborators/:userId')
  async removeCollaborator(
    @Param('lessonId') lessonId: string,
    @Param('userId') userId: string,
    @Request() req: AdvancedRequest,
  ) {
    await this.lessonService.removeCollaborator(lessonId, userId, req.user?.sub);
    return { success: true };
  }
}
