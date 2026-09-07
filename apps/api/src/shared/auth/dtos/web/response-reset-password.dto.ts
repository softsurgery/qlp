import { ApiProperty } from '@nestjs/swagger';

export class ResponseResetPasswordDto {
  @ApiProperty({ type: Boolean, example: true })
  success: boolean;

  @ApiProperty({ type: String, example: 'Password reset successfully' })
  message: string;
}
