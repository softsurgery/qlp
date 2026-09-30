import { ApiProperty } from '@nestjs/swagger';
import { ResponseCurriculumModuleDto } from './response-curriculum-module.dto';
import { ResponseWorkflowDto } from 'src/shared/workflows/dtos/response-workflow.dto';

export class ResponseCurriculumModuleWorkflowDto extends ResponseWorkflowDto {
  @ApiProperty({ type: ResponseCurriculumModuleDto })
  module: ResponseCurriculumModuleDto;
}
