import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class RequestResetPasswordDto {
  @ApiProperty({ type: String })
  @IsString()
  token: string;

  @ApiProperty({ type: String, example: 'super-secret-password' })
  @IsString()
  @MinLength(6)
  password: string;
}
