import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Request,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/shared/database/decorators/api-paginated-resposne.decorator';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { toDto, toDtoArray } from 'src/shared/database/utils/dtos';
import { LogInterceptor } from 'src/shared/logger/decorators/logger.interceptor';
import { LogEvent } from 'src/shared/logger/decorators/log-event.decorator';
import { EventType } from 'src/app/enums/event-type.enum';
import { AdvancedRequest } from 'src/types';
import { CurriculumService } from '../../services/curriculum.service';
import { CreateCurriculumDto } from '../../dtos/curriculum/create-curriculum.dto';
import { UpdateCurriculumDto } from '../../dtos/curriculum/update-curriculum.dto';
import { ResponseCurriculumDto } from '../../dtos/curriculum/response-curriculum.dto';

@ApiTags('curriculum')
@ApiBearerAuth('access_token')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(LogInterceptor)
@Controller({ version: '1', path: '/curriculum' })
export class ClientCurriculumController {
  constructor(private readonly curriculumService: CurriculumService) {}

  @Get('/list')
  @ApiPaginatedResponse(ResponseCurriculumDto)
  async findAllPaginated(@Query() query: IQueryObject): Promise<PageDto<ResponseCurriculumDto>> {
    const paginated = await this.curriculumService.findAllPaginated(query);
    return { ...paginated, data: toDtoArray(ResponseCurriculumDto, paginated.data) };
  }

  @Get('/all')
  async findAll(@Query() query: IQueryObject): Promise<ResponseCurriculumDto[]> {
    return toDtoArray(ResponseCurriculumDto, await this.curriculumService.findAll(query));
  }

  @Get('/:id/versions/:version')
  async findOneByVersion(
    @Param('id') id: string,
    @Param('version', ParseIntPipe) version: number,
    @Query('join') join?: string,
  ): Promise<ResponseCurriculumDto> {
    return toDto(
      ResponseCurriculumDto,
      await this.curriculumService.findOneByVersion(id, version, join),
    );
  }

  @Get('/:id/versions')
  @ApiPaginatedResponse(ResponseCurriculumDto)
  async findVersions(
    @Param('id') id: string,
    @Query() query: IQueryObject,
  ): Promise<PageDto<ResponseCurriculumDto>> {
    const paginated = await this.curriculumService.findAllVersionsPaginated(id, query);
    return { ...paginated, data: toDtoArray(ResponseCurriculumDto, paginated.data) };
  }

  @Get('/:id')
  async findOneById(
    @Param('id') id: string,
    @Query('join') join?: string,
  ): Promise<ResponseCurriculumDto> {
    return toDto(ResponseCurriculumDto, await this.curriculumService.findOneById(id, join));
  }

  @Post()
  @LogEvent(EventType.CURRICULUM_CREATED)
  async create(
    @Body() dto: CreateCurriculumDto,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseCurriculumDto> {
    if (!dto.ownerId && req.user?.sub) {
      dto.ownerId = req.user.sub;
    }
    if (!req.user?.sub) {
      throw new UnauthorizedException();
    }
    const curriculum = await this.curriculumService.createCurriculum(dto, req.user?.sub);
    req.logInfo = { id: curriculum.id, title: curriculum.title };
    return toDto(ResponseCurriculumDto, curriculum);
  }

  @Put('/:id')
  @LogEvent(EventType.CURRICULUM_UPDATED)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCurriculumDto,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseCurriculumDto> {
    const curriculum = await this.curriculumService.updateCurriculum(id, dto, req.user?.sub);
    req.logInfo = { id: curriculum.id, version: curriculum.version };
    return toDto(ResponseCurriculumDto, curriculum);
  }

  @Delete('/:id')
  @LogEvent(EventType.CURRICULUM_DELETED)
  async delete(
    @Param('id') id: string,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseCurriculumDto | null> {
    req.logInfo = { id };
    return toDto(ResponseCurriculumDto, await this.curriculumService.softDelete(id));
  }
}
