import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ResponseVersionedDtoHelper } from '../response-versioned.dto';
import { ResponseCurriculumLessonDto } from '../lesson/response-curriculum-lesson.dto';
import { ResponseCurriculumExamDto } from '../exam/response-curriculum-exam.dto';
import { ResponseUserDto } from 'src/modules/user-management/dtos/user/response-user.dto';

export class ResponseCurriculumModuleDto extends ResponseVersionedDtoHelper {
  @ApiProperty()
  @Expose()
  curriculumId: string;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty({ required: false })
  @Expose()
  description?: string;

  @ApiProperty()
  @Expose()
  sortOrder: number;

  @ApiProperty({ type: [ResponseCurriculumLessonDto], required: false })
  @Expose()
  @Type(() => ResponseCurriculumLessonDto)
  lessons?: ResponseCurriculumLessonDto[];

  @ApiProperty({ type: [ResponseCurriculumExamDto], required: false })
  @Expose()
  @Type(() => ResponseCurriculumExamDto)
  exams?: ResponseCurriculumExamDto[];

  @ApiProperty({ required: false })
  @Expose()
  createdById?: string;

  @ApiProperty({ required: false, type: () => ResponseUserDto })
  @Type(() => ResponseUserDto)
  @Expose()
  createdBy?: ResponseUserDto;
}
