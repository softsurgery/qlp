import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ResponseVersionedDtoHelper } from '../response-versioned.dto';
import { ResponseExamQuestionDto } from './response-exam-question.dto';

export class ResponseCurriculumExamDto extends ResponseVersionedDtoHelper {
  @ApiProperty()
  @Expose()
  moduleId: string;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty({ required: false })
  @Expose()
  description?: string;

  @ApiProperty({ required: false })
  @Expose()
  durationMinutes?: number;

  @ApiProperty()
  @Expose()
  passingScore: number;

  @ApiProperty({ type: [ResponseExamQuestionDto] })
  @Expose()
  @Type(() => ResponseExamQuestionDto)
  questions: ResponseExamQuestionDto[];

  @ApiProperty()
  @Expose()
  sortOrder: number;
}
