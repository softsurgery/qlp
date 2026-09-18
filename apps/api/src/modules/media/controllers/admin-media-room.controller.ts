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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/shared/database/decorators/api-paginated-resposne.decorator';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { toDto, toDtoArray } from 'src/shared/database/utils/dtos';
import { LogInterceptor } from 'src/shared/logger/decorators/logger.interceptor';
import { LogEvent } from 'src/shared/logger/decorators/log-event.decorator';
import { EventType } from 'src/app/enums/event-type.enum';
import { AdvancedRequest } from 'src/types';
import { MediaRoomService } from '../services/media-room.service';
import { MediaRoomParticipantService } from '../services/media-room-participant.service';
import { CreateMediaRoomDto } from '../dtos/create-media-room.dto';
import { UpdateMediaRoomDto } from '../dtos/update-media-room.dto';
import { CreateMediaRoomParticipantDto } from '../dtos/create-media-room-participant.dto';
import { ResponseMediaRoomDto } from '../dtos/response-media-room.dto';
import { ResponseMediaRoomParticipantDto } from '../dtos/response-media-room-participant.dto';

@ApiTags('media')
@ApiBearerAuth('access_token')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(LogInterceptor)
@Controller({ version: '1', path: '/media/rooms' })
export class AdminMediaRoomController {
  constructor(
    private readonly mediaRoomService: MediaRoomService,
    private readonly participantService: MediaRoomParticipantService,
  ) {}

  private async assertManageable(id: string, req: AdvancedRequest) {
    if (!req.user?.sub) throw new UnauthorizedException();
    const room = await this.mediaRoomService.findRoomOrFail(id);
    return this.mediaRoomService.assertCanManage(room, req.user.sub);
  }

  @Get('/list')
  @ApiPaginatedResponse(ResponseMediaRoomDto)
  async findAllPaginated(@Query() query: IQueryObject): Promise<PageDto<ResponseMediaRoomDto>> {
    const paginated = await this.mediaRoomService.findAllPaginated(query);
    return { ...paginated, data: toDtoArray(ResponseMediaRoomDto, paginated.data) };
  }

  @Get('/all')
  async findAll(@Query() query: IQueryObject): Promise<ResponseMediaRoomDto[]> {
    return toDtoArray(ResponseMediaRoomDto, await this.mediaRoomService.findAll(query));
  }

  @Get('/:id/participants')
  async findParticipants(@Param('id') id: string): Promise<ResponseMediaRoomParticipantDto[]> {
    return toDtoArray(
      ResponseMediaRoomParticipantDto,
      await this.participantService.findByRoom(id),
    );
  }

  @Get('/:id')
  async findOneById(@Param('id') id: string): Promise<ResponseMediaRoomDto> {
    return toDto(ResponseMediaRoomDto, await this.mediaRoomService.findRoomOrFail(id));
  }

  @Post()
  @ApiOperation({ summary: 'Schedule a live session and seed its roster' })
  @LogEvent(EventType.MEDIA_ROOM_CREATED)
  async create(
    @Body() dto: CreateMediaRoomDto,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseMediaRoomDto> {
    if (!req.user?.sub) throw new UnauthorizedException();

    const room = await this.mediaRoomService.createRoom(dto, req.user.sub);
    req.logInfo = { id: room.id, roomName: room.roomName, hostId: room.hostId };

    return toDto(ResponseMediaRoomDto, room);
  }

  @Put('/:id')
  @LogEvent(EventType.MEDIA_ROOM_UPDATED)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateMediaRoomDto,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseMediaRoomDto> {
    await this.assertManageable(id, req);
    req.logInfo = { id };
    return toDto(ResponseMediaRoomDto, await this.mediaRoomService.updateRoom(id, dto));
  }

  @Post('/:id/participants')
  @LogEvent(EventType.MEDIA_PARTICIPANT_ADDED)
  async addParticipant(
    @Param('id') id: string,
    @Body() dto: CreateMediaRoomParticipantDto,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseMediaRoomParticipantDto> {
    await this.assertManageable(id, req);
    req.logInfo = { roomId: id, userId: dto.userId, role: dto.role };

    return toDto(
      ResponseMediaRoomParticipantDto,
      await this.mediaRoomService.inviteParticipant(id, dto.userId, dto.role),
    );
  }

  @Delete('/:id/participants/:userId')
  @LogEvent(EventType.MEDIA_PARTICIPANT_REMOVED)
  async removeParticipant(
    @Param('id') id: string,
    @Param('userId') userId: string,
    @Request() req: AdvancedRequest,
  ): Promise<void> {
    await this.assertManageable(id, req);
    req.logInfo = { roomId: id, userId };
    await this.participantService.removeFromRoom(id, userId);
  }

  @Delete('/:id')
  @LogEvent(EventType.MEDIA_ROOM_DELETED)
  async delete(
    @Param('id') id: string,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseMediaRoomDto | null> {
    await this.assertManageable(id, req);
    req.logInfo = { id };
    return toDto(ResponseMediaRoomDto, await this.mediaRoomService.deleteRoom(id));
  }
}
