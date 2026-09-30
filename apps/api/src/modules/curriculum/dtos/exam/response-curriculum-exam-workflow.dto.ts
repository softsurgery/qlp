import { ApiProperty } from '@nestjs/swagger';
import { ResponseCurriculumExamDto } from './response-curriculum-exam.dto';
import { ResponseWorkflowDto } from 'src/shared/workflows/dtos/response-workflow.dto';

export class ResponseCurriculumExamWorkflowDto extends ResponseWorkflowDto {
  @ApiProperty({ type: ResponseCurriculumExamDto })
  exam: ResponseCurriculumExamDto;
}
