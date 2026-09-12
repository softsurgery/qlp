import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { CurriculumStatus } from '../../enums/curriculum-status.enum';
import { ResponseVersionedDtoHelper } from '../response-versioned.dto';
import { ResponseUserDto } from 'src/modules/user-management/dtos/user/response-user.dto';

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

  @ApiProperty({ required: false })
  @Expose()
  ownerId?: string;

  @ApiProperty({ required: false, type: () => ResponseUserDto })
  @Type(() => ResponseUserDto)
  @Expose()
  owner?: ResponseUserDto;

  @ApiProperty({ required: false })
  @Expose()
  createdById?: string;

  @ApiProperty({ required: false, type: () => ResponseUserDto })
  @Type(() => ResponseUserDto)
  @Expose()
  createdBy?: ResponseUserDto;
}
