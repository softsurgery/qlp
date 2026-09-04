import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateAbstractUserDto } from 'src/shared/abstract-user-management/dtos/abstract-user/create-abstract-user.dto';
import { Gender } from '../../enums/gender.enum';

export class CreateUserDto extends CreateAbstractUserDto {
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
