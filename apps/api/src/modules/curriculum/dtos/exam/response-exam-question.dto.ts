import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ResponseExamQuestionDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  prompt: string;

  @ApiProperty()
  @Expose()
  type: string;

  @ApiProperty({ type: [String], required: false })
  @Expose()
  options?: string[];

  @ApiProperty({ required: false })
  @Expose()
  answer?: string;

  @ApiProperty()
  @Expose()
  points: number;
}
