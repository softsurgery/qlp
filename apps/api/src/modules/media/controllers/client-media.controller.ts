import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Post,
  Request,
  UnauthorizedException,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { toDto } from 'src/shared/database/utils/dtos';
import { LogInterceptor } from 'src/shared/logger/decorators/logger.interceptor';
import { LogEvent } from 'src/shared/logger/decorators/log-event.decorator';
import { EventType } from 'src/app/enums/event-type.enum';
import { AdvancedRequest } from 'src/types';
import { MediaService } from '../services/media.service';
import { CreateMediaTokenDto } from '../dtos/create-media-token.dto';
import { ResponseMediaTokenDto } from '../dtos/response-media-token.dto';

@ApiTags('media')
@ApiBearerAuth('access_token')
@UseInterceptors(ClassSerializerInterceptor)
@UseInterceptors(LogInterceptor)
@Controller({ version: '1', path: '/media' })
export class ClientMediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('/token')
  @ApiOperation({
    summary: 'Issue a least-privilege LiveKit join token',
    description:
      'The participant identity is taken from the bearer token, never from the body. ' +
      'A requested role is honoured only when it is narrower than the role the session roster grants.',
  })
  @LogEvent(EventType.MEDIA_TOKEN_ISSUED)
  async requestToken(
    @Body() dto: CreateMediaTokenDto,
    @Request() req: AdvancedRequest,
  ): Promise<ResponseMediaTokenDto> {
    if (!req.user?.sub) throw new UnauthorizedException();

    const issued = await this.mediaService.issueToken(dto, req.user.sub);
    req.logInfo = { roomId: dto.roomId, roomName: issued.roomName, role: issued.role };

    return toDto(ResponseMediaTokenDto, issued);
  }
}
