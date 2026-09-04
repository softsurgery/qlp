import { DatabaseEntity } from "./utils/database-entity.js";

export interface Upload extends DatabaseEntity {
  id: number;
  slug: string;
  filename: string;
  relativePath: string;
  mimetype: string;
  size: number;
}

export interface ResponseGenericUploadDto extends DatabaseEntity {
  id: number;
  uploadId: number;
  upload: Upload;
  order: number;
}

export interface UpdateGenericUploadDto {
  uploadId: number;
  order: number;
  id?: number;
}
