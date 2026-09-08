import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { CurriculumStatus } from '../../enums/curriculum-status.enum';
import { ResponseVersionedDtoHelper } from '../response-versioned.dto';

export class ResponseCurriculumDto extends ResponseVersionedDtoHelper {
  @ApiProperty()
  @Expose()
  slug: string;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty({ required: false })
  @Expose()
  description?: string;

  @ApiProperty({ enum: CurriculumStatus })
  @Expose()
  status: CurriculumStatus;
}
