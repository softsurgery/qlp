import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ResponseVersionedDtoHelper } from '../response-versioned.dto';
import { ResponseCurriculumLessonMaterialDto } from '../material/response-curriculum-lesson-material.dto';
import { ResponseUserDto } from 'src/modules/user-management/dtos/user/response-user.dto';
import { CurriculumStatus } from '../../enums/curriculum-status.enum';

export class ResponseCurriculumLessonDto extends ResponseVersionedDtoHelper {
  @ApiProperty()
  @Expose()
  moduleId: string;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty({ required: false })
  @Expose()
  description?: string;

  @ApiProperty({ enum: CurriculumStatus })
  @Expose()
  status: CurriculumStatus;

  @ApiProperty()
  @Expose()
  sortOrder: number;

  @ApiProperty({ type: [ResponseCurriculumLessonMaterialDto], required: false })
  @Expose()
  @Type(() => ResponseCurriculumLessonMaterialDto)
  materials?: ResponseCurriculumLessonMaterialDto[];

  @ApiProperty({ required: false })
  @Expose()
  createdById?: string;

  @ApiProperty({ required: false, type: () => ResponseUserDto })
  @Type(() => ResponseUserDto)
  @Expose()
  createdBy?: ResponseUserDto;
}
