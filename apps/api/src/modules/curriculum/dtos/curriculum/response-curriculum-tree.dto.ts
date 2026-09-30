import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ResponseCurriculumDto } from './response-curriculum.dto';
import { ResponseCurriculumModuleDto } from '../module/response-curriculum-module.dto';

export class ResponseCurriculumTreeDto extends ResponseCurriculumDto {
  @ApiProperty({ type: [ResponseCurriculumModuleDto] })
  @Expose()
  @Type(() => ResponseCurriculumModuleDto)
  modules: ResponseCurriculumModuleDto[];
}
