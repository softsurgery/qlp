import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { UserEntity } from '../entities/user.entity';
import { UserNotFoundException } from 'src/shared/abstract-user-management/errors/user/user.notfound.error';
import { AbstractUserService } from 'src/shared/abstract-user-management/services/abstract-user.service';
import { StorageService } from 'src/shared/storage/services/storage.service';
import { UserRepository } from '../repositories/user.repository';
import { DeepPartial } from 'typeorm';
import { hashPassword } from 'src/shared/auth/utils/hash.utils';
import { UserStorageFolderService } from './user-storage-folder.service';

@Injectable()
export class UserService extends AbstractUserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly storageService: StorageService,
    private readonly userStorageFolderService: UserStorageFolderService,
  ) {
    super(userRepository);
  }

  //Extended Methods ===========================================================================

  @Transactional()
  async extendedSave(createUserDto: DeepPartial<UserEntity>): Promise<UserEntity> {
    const { ...rest } = createUserDto;
    if (createUserDto.pictureId) await this.storageService.confirm(createUserDto.pictureId);

    const user = await this.userRepository.save({
      ...rest,
      password: rest.password ? await hashPassword(rest.password) : undefined,
    });

    if (createUserDto.pictureId) {
      await this.userStorageFolderService.assignProfilePicture(createUserDto.pictureId);
    }

    return user;
  }

  @Transactional()
  async extendedUpdate(
    id: string,
    updateUserDto: DeepPartial<UserEntity>,
  ): Promise<UserEntity | null> {
    const { pictureId, ...rest } = updateUserDto;
    const existingUser = (await this.findOneById(id)) as UserEntity;
    if (!existingUser) throw new UserNotFoundException();

    if (rest.password) {
      rest.password = await hashPassword(rest.password);
    }

    const updatedUser = await this.userRepository.update(id, {
      ...rest,
      pictureId: pictureId ?? existingUser.pictureId,
    });

    if (pictureId && pictureId !== existingUser.pictureId) {
      await this.storageService.confirm(pictureId);
      if (existingUser.pictureId) await this.storageService.delete(existingUser.pictureId);

      await this.userStorageFolderService.assignProfilePicture(pictureId);
    }

    return updatedUser;
  }
}
