import { Injectable } from '@nestjs/common';
import { StorageFolderEntity } from 'src/shared/storage/entities/storage-folder.entity';
import { StorageFolderService } from 'src/shared/storage/services/storage-folder.service';
import { STORAGE_FOLDER_SYSTEMATICS } from 'src/app/constants/storage/storage-folder-systematics.constants';

@Injectable()
export class UserStorageFolderService {
  constructor(private readonly storageFolderService: StorageFolderService) {}

  async ensureProfilePicturesFolder(): Promise<StorageFolderEntity> {
    return this.storageFolderService.findOrCreate({
      name: 'Profile Pictures',
      systematicName: STORAGE_FOLDER_SYSTEMATICS.USER_PROFILE_PICTURES,
    });
  }

  async assignProfilePicture(uploadId: number): Promise<void> {
    const folder = await this.ensureProfilePicturesFolder();
    await this.storageFolderService.assignFileToFolder(uploadId, folder.id);
  }
}
