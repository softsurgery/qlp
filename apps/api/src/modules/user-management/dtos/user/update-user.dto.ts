import { ApiProperty } from '@nestjs/swagger';
import { UpdateAbstractUserDto } from 'src/shared/abstract-user-management/dtos/abstract-user/update-abstract-user.dto';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Gender } from '../../enums/gender.enum';

export class UpdateUserDto extends UpdateAbstractUserDto {
  @ApiProperty({ type: String })
  @IsString()
  @IsOptional()
  bio?: string;

  @ApiProperty({ type: String, enum: Gender, example: Gender.Male })
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @ApiProperty({ type: Number })
  @IsNumber()
  @IsOptional()
  pictureId?: number;
}
