import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { ResponseVersionedDtoHelper } from '../response-versioned.dto';
import { ResponseStorageDto } from 'src/shared/storage/dtos/response-storage.dto';
import { Type } from 'class-transformer';

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

  @ApiProperty({ type: () => ResponseStorageDto, required: false })
  @Expose()
  @Type(() => ResponseStorageDto)
  storage?: ResponseStorageDto;

  @ApiProperty()
  @Expose()
  sortOrder: number;
}
