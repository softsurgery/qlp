import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ResponseDtoHelper } from 'src/shared/database/dtos/database.response.dto';
import { ResponseAbstractUserDto } from 'src/shared/abstract-user-management/dtos/abstract-user/response-abstract-user.dto';
import { EventType } from 'src/app/enums/event-type.enum';

export class ResponseLogDto extends ResponseDtoHelper {
  @ApiProperty({ type: Number, example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ type: String, enum: EventType })
  @Expose()
  event: EventType;

  @ApiProperty({ type: String, example: '/api/v1/user/list' })
  @Expose()
  api?: string;

  @ApiProperty({ type: String, example: 'GET' })
  @Expose()
  method?: string;

  @ApiProperty({ type: String, example: '1' })
  @Expose()
  userId?: string;

  @ApiProperty({ type: ResponseAbstractUserDto })
  @Expose()
  @Type(() => ResponseAbstractUserDto)
  user: ResponseAbstractUserDto;

  @ApiProperty({ type: Object })
  @Expose()
  logInfo?: unknown;
}
