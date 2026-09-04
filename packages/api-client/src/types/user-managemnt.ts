import { Upload } from "./upload.js";
import { DatabaseEntity } from "./utils/database-entity.js";

//abstract user dtos *****************************************************************************

interface ResponseAbstractUsertDto extends DatabaseEntity {
  id: string;
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  isActive?: boolean;
  username: string;
  email: string;
  emailVerified?: Date;
}

interface CreateAbstractUserDto {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: Date;
  isActive?: boolean;
  password?: string;
  username: string;
  email: string;
  roleId?: string;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-unused-vars
interface UpdateAbstractUserDto extends Partial<CreateAbstractUserDto> {}

// user dtos ************************************************************************************

export interface ResponseUserDto extends ResponseAbstractUsertDto {
  bio?: string;
  gender?: Gender;
  pictureId?: number;
  picture?: Upload;
}

export interface CreateUserDto extends CreateAbstractUserDto {
  bio?: string;
  gender?: Gender;
  pictureId?: number;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface UpdateUserDto extends Partial<CreateUserDto> {}

export enum Gender {
  Male = "Male",
  Female = "Female",
}
