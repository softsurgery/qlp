import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { ResponseStorageDto } from 'src/shared/storage/dtos/response-storage.dto';
import { ResponseAbstractUserDto } from 'src/shared/abstract-user-management/dtos/abstract-user/response-abstract-user.dto';
import { Gender } from '../../enums/gender.enum';

export class ResponseUserDto extends ResponseAbstractUserDto {
  @ApiProperty({ type: String })
  @Expose()
  bio?: string;

  @ApiProperty({ type: String, enum: Gender, example: Gender.Male })
  @Expose()
  gender?: Gender;

  @ApiProperty({ type: Number })
  @Expose()
  pictureId?: number;

  @ApiProperty({ type: ResponseStorageDto })
  @Expose()
  @Type(() => ResponseStorageDto)
  picture?: ResponseStorageDto;
}
