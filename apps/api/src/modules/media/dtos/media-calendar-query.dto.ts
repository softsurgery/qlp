import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class MediaCalendarQueryDto {
  @ApiProperty({ type: String, description: 'ISO-8601 start of the window' })
  @IsDateString()
  from: string;

  @ApiProperty({ type: String, description: 'ISO-8601 end of the window' })
  @IsDateString()
  to: string;

  @ApiProperty({ required: false, description: 'Admins only - narrow to one host' })
  @IsString()
  @IsOptional()
  hostId?: string;
}
