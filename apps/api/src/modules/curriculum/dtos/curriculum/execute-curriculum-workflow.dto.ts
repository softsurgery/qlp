import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { CurriculumEvent } from '../../enums/curriculum-event.enum';

export class ExecuteCurriculumWorkflowDto {
  @ApiProperty({ enum: CurriculumEvent })
  @IsEnum(CurriculumEvent)
  @IsNotEmpty()
  event: CurriculumEvent;
}
