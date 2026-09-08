import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { CurriculumStatus } from '../../enums/curriculum-status.enum';

export class CreateCurriculumDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: CurriculumStatus, required: false })
  @IsEnum(CurriculumStatus)
  @IsOptional()
  status?: CurriculumStatus;
}
