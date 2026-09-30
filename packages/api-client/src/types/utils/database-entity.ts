export interface DatabaseEntity {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  isDeletionRestricted: boolean;
}

export interface VersionedEntity extends DatabaseEntity {
  id: string;
  version: number;
  isLatest: boolean;
}
