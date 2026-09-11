import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';
import { CollaboratorRole } from '../../enums/collaborator-role.enum';

export class UpdateCollaboratorDto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty({ enum: CollaboratorRole })
  @IsEnum(CollaboratorRole)
  role: CollaboratorRole;
}
