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
import { CurriculumLessonMaterialService } from '../services/curriculum-lesson-material.service';
import { CreateCurriculumMaterialDto } from '../dtos/material/create-curriculum-material.dto';
import { UpdateCurriculumMaterialDto } from '../dtos/material/update-curriculum-material.dto';
import { ResponseCurriculumLessonMaterialDto } from '../dtos/material/response-curriculum-lesson-material.dto';

@ApiTags('curriculum-material')
@ApiBearerAuth('access_token')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(LogInterceptor)
@Controller({ version: '1', path: '/curriculum' })
export class ClientCurriculumLessonMaterialController {
  constructor(private readonly materialService: CurriculumLessonMaterialService) {}

  @Get('/materials/:materialId/versions')
  async findVersions(
    @Param('materialId') materialId: string,
  ): Promise<ResponseCurriculumLessonMaterialDto[]> {
    return toDtoArray(
      ResponseCurriculumLessonMaterialDto,
      await this.materialService.findAllVersions(materialId),
    );
  }

  @Post('/lessons/:lessonId/materials')
  @LogEvent(EventType.CURRICULUM_MATERIAL_CREATED)
  async create(
    @Param('lessonId') lessonId: string,
    @Body() dto: CreateCurriculumMaterialDto,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseCurriculumLessonMaterialDto> {
    const material = await this.materialService.createForLesson(lessonId, dto);
    req.logInfo = { id: material.id, lessonId };
    return toDto(ResponseCurriculumLessonMaterialDto, material);
  }

  @Put('/materials/:materialId')
  @LogEvent(EventType.CURRICULUM_MATERIAL_UPDATED)
  async update(
    @Param('materialId') materialId: string,
    @Body() dto: UpdateCurriculumMaterialDto,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseCurriculumLessonMaterialDto> {
    const material = await this.materialService.updateMaterial(materialId, dto);
    req.logInfo = { id: material.id, version: material.version };
    return toDto(ResponseCurriculumLessonMaterialDto, material);
  }

  @Delete('/materials/:materialId')
  @LogEvent(EventType.CURRICULUM_MATERIAL_DELETED)
  async delete(
    @Param('materialId') materialId: string,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseCurriculumLessonMaterialDto | null> {
    req.logInfo = { id: materialId };
    return toDto(ResponseCurriculumLessonMaterialDto, await this.materialService.softDelete(materialId));
  }
}
