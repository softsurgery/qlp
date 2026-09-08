import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ResponseVersionedDtoHelper } from '../response-versioned.dto';

export class ResponseCurriculumLessonMaterialDto extends ResponseVersionedDtoHelper {
  @ApiProperty()
  @Expose()
  lessonId: string;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty({ required: false })
  @Expose()
  description?: string;

  @ApiProperty()
  @Expose()
  type: string;

  @ApiProperty({ required: false })
  @Expose()
  content?: string;

  @ApiProperty({ required: false })
  @Expose()
  storageId?: number;

  @ApiProperty()
  @Expose()
  sortOrder: number;
}
