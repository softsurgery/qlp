import { Module } from '@nestjs/common';
import { PermissionService } from 'src/shared/abstract-user-management/services/permission.service';
import { RolePermissionService } from 'src/shared/abstract-user-management/services/role-permission.service';
import { RoleService } from 'src/shared/abstract-user-management/services/role.service';
import { RoleRepository } from 'src/shared/abstract-user-management/repositories/role.repository';
import { PermissionRepository } from 'src/shared/abstract-user-management/repositories/permission.repository';
import { RolePermissionRepository } from 'src/shared/abstract-user-management/repositories/role-permission.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleEntity } from 'src/shared/abstract-user-management/entities/role.entity';
import { PermissionEntity } from 'src/shared/abstract-user-management/entities/permission.entity';
import { RolePermissionEntity } from 'src/shared/abstract-user-management/entities/role-permission.entity';
import { UserEntity } from './entities/user.entity';
import { StorageModule } from 'src/shared/storage/storage.module';
import { UserService } from './services/user.service';
import { UserRepository } from './repositories/user.repository';
import { UserStorageFolderService } from './services/user-storage-folder.service';
import { ConfigurationsModule } from 'src/shared/configurations/configurations.module';

@Module({
  controllers: [],
  providers: [
    //services
    UserService,
    UserStorageFolderService,

    RoleService,
    PermissionService,
    RolePermissionService,

    //repositories
    UserRepository,

    RoleRepository,
    PermissionRepository,
    RolePermissionRepository,
  ],
  exports: [
    //services
    UserService,
    UserStorageFolderService,

    RoleService,
    PermissionService,
    RolePermissionService,

    //repositories
    UserRepository,

    RoleRepository,
    PermissionRepository,
    RolePermissionRepository,
  ],
  imports: [
    TypeOrmModule.forFeature([UserEntity, RoleEntity, PermissionEntity, RolePermissionEntity]),
    StorageModule,
    ConfigurationsModule,
  ],
})
export class UserManagementModule {}
