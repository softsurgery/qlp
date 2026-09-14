import { ApiProperty } from '@nestjs/swagger';
import { ResponseCurriculumLessonDto } from './response-curriculum-lesson.dto';
import { ResponseWorkflowDto } from 'src/shared/workflows/dtos/response-workflow.dto';

export class ResponseCurriculumLessonWorkflowDto extends ResponseWorkflowDto {
  @ApiProperty({ type: ResponseCurriculumLessonDto })
  lesson: ResponseCurriculumLessonDto;
}
