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
import { toDto, toDtoArray } from 'src/shared/database/utils/dtos';
import { LogInterceptor } from 'src/shared/logger/decorators/logger.interceptor';
import { LogEvent } from 'src/shared/logger/decorators/log-event.decorator';
import { EventType } from 'src/app/enums/event-type.enum';
import { AdvancedRequest } from 'src/types';
import { MediaService } from '../services/media.service';
import { MediaRoomService } from '../services/media-room.service';
import { MediaRoomParticipantService } from '../services/media-room-participant.service';
import { CreateMediaRoomDto } from '../dtos/create-media-room.dto';
import { UpdateMediaRoomDto } from '../dtos/update-media-room.dto';
import { CreateMediaRoomParticipantDto } from '../dtos/create-media-room-participant.dto';
import { ResponseMediaRoomDto } from '../dtos/response-media-room.dto';
import { ResponseMediaRoomParticipantDto } from '../dtos/response-media-room-participant.dto';
import { ResponseMediaRoomSummaryDto } from '../dtos/response-media-room-summary.dto';

@ApiTags('media')
@ApiBearerAuth('access_token')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(LogInterceptor)
@Controller({ version: '1', path: '/media/meetings' })
export class ClientMeetingController {
  constructor(
    private readonly mediaService: MediaService,
    private readonly mediaRoomService: MediaRoomService,
    private readonly participantService: MediaRoomParticipantService,
  ) {}

  private requireUser(req: AdvancedRequest): string {
    if (!req.user?.sub) throw new UnauthorizedException();
    return req.user.sub;
  }

  @Get('/capabilities')
  @ApiOperation({
    summary: 'What the caller may do',
    description:
      'Lets the UI hide actions the server would refuse, rather than offering them and failing.',
  })
  async capabilities(
    @Request() req: AdvancedRequest,
  ): Promise<{ canSchedule: boolean; isAdmin: boolean }> {
    return this.mediaService.getCapabilities(this.requireUser(req));
  }

  @Get('/:id/participants')
  async participants(
    @Param('id') id: string,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseMediaRoomParticipantDto[]> {
    const room = await this.mediaRoomService.findRoomOrFail(id);
    await this.mediaRoomService.assertCanManage(room, this.requireUser(req));
    return toDtoArray(ResponseMediaRoomParticipantDto, await this.participantService.findByRoom(id));
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Full session detail, for the host or an admin' })
  async findOne(
    @Param('id') id: string,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseMediaRoomDto> {
    const room = await this.mediaRoomService.findRoomOrFail(id);
    await this.mediaRoomService.assertCanManage(room, this.requireUser(req));
    return toDto(ResponseMediaRoomDto, room);
  }

  @Post()
  @ApiOperation({
    summary: 'Schedule a session',
    description:
      'Tutors always host what they create. Only admins may set hostId to another user, ' +
      'and only to a user who is allowed to host.',
  })
  @LogEvent(EventType.MEDIA_ROOM_CREATED)
  async create(
    @Body() dto: CreateMediaRoomDto,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseMediaRoomDto> {
    const room = await this.mediaRoomService.createRoom(dto, this.requireUser(req));
    req.logInfo = { id: room.id, hostId: room.hostId, capacity: room.maxParticipants };
    return toDto(ResponseMediaRoomDto, room);
  }

  @Put('/:id')
  @LogEvent(EventType.MEDIA_ROOM_UPDATED)
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateMediaRoomDto,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseMediaRoomDto> {
    const room = await this.mediaRoomService.findRoomOrFail(id);
    await this.mediaRoomService.assertCanManage(room, this.requireUser(req));
    req.logInfo = { id };
    return toDto(ResponseMediaRoomDto, await this.mediaRoomService.updateRoom(id, dto));
  }

  @Post('/:id/end')
  @ApiOperation({ summary: 'Close the session and tear the room down on the SFU' })
  @LogEvent(EventType.MEDIA_ROOM_ENDED)
  async end(
    @Param('id') id: string,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseMediaRoomSummaryDto> {
    const room = await this.mediaRoomService.findRoomOrFail(id);
    await this.mediaRoomService.assertCanManage(room, this.requireUser(req));
    req.logInfo = { id };
    return toDto(ResponseMediaRoomSummaryDto, await this.mediaService.endRoom(id));
  }

  @Post('/:id/participants')
  @ApiOperation({ summary: 'Invite someone, refused once the reserved spots are taken' })
  @LogEvent(EventType.MEDIA_PARTICIPANT_ADDED)
  async invite(
    @Param('id') id: string,
    @Body() dto: CreateMediaRoomParticipantDto,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseMediaRoomParticipantDto> {
    const room = await this.mediaRoomService.findRoomOrFail(id);
    await this.mediaRoomService.assertCanManage(room, this.requireUser(req));
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
    const room = await this.mediaRoomService.findRoomOrFail(id);
    await this.mediaRoomService.assertCanManage(room, this.requireUser(req));
    req.logInfo = { roomId: id, userId };
    await this.participantService.removeFromRoom(id, userId);
  }

  @Delete('/:id')
  @LogEvent(EventType.MEDIA_ROOM_DELETED)
  async remove(
    @Param('id') id: string,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseMediaRoomDto | null> {
    const room = await this.mediaRoomService.findRoomOrFail(id);
    await this.mediaRoomService.assertCanManage(room, this.requireUser(req));
    req.logInfo = { id };
    return toDto(ResponseMediaRoomDto, await this.mediaRoomService.deleteRoom(id));
  }
}
