import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ExamQuestionType } from '../../enums/exam-question-type.enum';

export class ExamQuestionDto {
  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  id?: string;

  @ApiProperty()
  @IsString()
  prompt: string;

  @ApiProperty({ enum: ExamQuestionType })
  @IsEnum(ExamQuestionType)
  type: ExamQuestionType;

  @ApiProperty({ type: [String], required: false })
  @IsString({ each: true })
  @IsOptional()
  options?: string[];

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  answer?: string;

  @ApiProperty({ required: false })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  points?: number;
}
