import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { PermissionRepository } from '../repositories/permission.repository';
import { PermissionEntity } from '../entities/permission.entity';
import { CreatePermissionDto } from '../dtos/permission/create-permission.dto';
import { PermissionAlreadyExistsException } from '../errors/permission/permission.alreadyexists.error';
import { AbstractCrudService } from 'src/shared/database/services/abstract-crud.service';

@Injectable()
export class PermissionService extends AbstractCrudService<PermissionEntity> {
  constructor(private readonly permissionRepository: PermissionRepository) {
    super(permissionRepository);
  }

  @Transactional()
  async save(createPermissionDto: CreatePermissionDto) {
    const existingPermission = await this.permissionRepository.findOne({
      where: {
        label: createPermissionDto.label,
      },
    });
    if (existingPermission) throw new PermissionAlreadyExistsException();
    return this.permissionRepository.save(createPermissionDto);
  }

  async saveMany(createPermissionDto: CreatePermissionDto[]) {
    return this.permissionRepository.saveMany(createPermissionDto);
  }
}
