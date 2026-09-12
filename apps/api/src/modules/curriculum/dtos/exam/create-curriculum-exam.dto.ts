import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsOptional, IsString, Min, ValidateNested } from 'class-validator';
import { ExamQuestionDto } from './exam-question.dto';

export class CreateCurriculumExamDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ required: false })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  durationMinutes?: number;

  @ApiProperty({ required: false })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  passingScore?: number;

  @ApiProperty({ type: [ExamQuestionDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ExamQuestionDto)
  @IsOptional()
  questions?: ExamQuestionDto[];

  @ApiProperty({ required: false })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  sortOrder?: number;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  createdById?: string;
}
