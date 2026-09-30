import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ResponseWorkflowDto } from 'src/shared/workflows/dtos/response-workflow.dto';
import { ResponseCurriculumDto } from './response-curriculum.dto';

export class ResponseCurriculumWorkflowDto extends ResponseWorkflowDto {
  @ApiProperty({ type: () => ResponseCurriculumDto })
  @Type(() => ResponseCurriculumDto)
  @Expose()
  curriculum: ResponseCurriculumDto;
}
