import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ResponseDtoHelper } from 'src/shared/database/dtos/database.response.dto';

export class ResponseVersionedDtoHelper extends ResponseDtoHelper {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  version: number;

  @ApiProperty()
  @Expose()
  isLatest: boolean;
}
