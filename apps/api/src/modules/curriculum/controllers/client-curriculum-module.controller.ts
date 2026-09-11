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
import { CurriculumService } from '../services/curriculum.service';
import { CurriculumModuleService } from '../services/curriculum-module.service';
import { CreateCurriculumModuleDto } from '../dtos/module/create-curriculum-module.dto';
import { UpdateCurriculumModuleDto } from '../dtos/module/update-curriculum-module.dto';
import { ResponseCurriculumModuleDto } from '../dtos/module/response-curriculum-module.dto';

@ApiTags('curriculum-module')
@ApiBearerAuth('access_token')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(LogInterceptor)
@Controller({ version: '1', path: '/curriculum' })
export class ClientCurriculumModuleController {
  constructor(
    private readonly curriculumService: CurriculumService,
    private readonly moduleService: CurriculumModuleService,
  ) {}

  @Get('/modules/:moduleId/versions')
  async findVersions(@Param('moduleId') moduleId: string): Promise<ResponseCurriculumModuleDto[]> {
    return toDtoArray(
      ResponseCurriculumModuleDto,
      await this.moduleService.findAllVersions(moduleId),
    );
  }

  @Post('/:id/modules')
  @LogEvent(EventType.CURRICULUM_MODULE_CREATED)
  async create(
    @Param('id') id: string,
    @Body() dto: CreateCurriculumModuleDto,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseCurriculumModuleDto> {
    await this.curriculumService.findOneById(id);
    if (!dto.ownerId && req.user?.sub) {
      dto.ownerId = req.user.sub;
    }
    const module = await this.moduleService.createForCurriculum(id, dto);
    req.logInfo = { id: module.id, curriculumId: id };
    return toDto(ResponseCurriculumModuleDto, module);
  }

  @Put('/modules/:moduleId')
  @LogEvent(EventType.CURRICULUM_MODULE_UPDATED)
  async update(
    @Param('moduleId') moduleId: string,
    @Body() dto: UpdateCurriculumModuleDto,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseCurriculumModuleDto> {
    const module = await this.moduleService.updateModule(moduleId, dto, req.user?.sub);
    req.logInfo = { id: module.id, version: module.version };
    return toDto(ResponseCurriculumModuleDto, module);
  }

  @Delete('/modules/:moduleId')
  @LogEvent(EventType.CURRICULUM_MODULE_DELETED)
  async delete(
    @Param('moduleId') moduleId: string,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseCurriculumModuleDto | null> {
    req.logInfo = { id: moduleId };
    return toDto(
      ResponseCurriculumModuleDto,
      await this.moduleService.softDelete(moduleId, req.user?.sub),
    );
  }
}
