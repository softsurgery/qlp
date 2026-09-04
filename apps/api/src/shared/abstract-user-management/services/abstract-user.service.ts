import { Transactional } from '@nestjs-cls/transactional';
import { Injectable } from '@nestjs/common';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { QueryBuilder } from 'src/shared/database/utils/database-query-builder';
import { AbstractUserEntity } from '../entities/abstract-user.entity';
import { DatabaseAbstractRepository } from 'src/shared/database/repositories/database.repository';
import { hashPassword } from 'src/shared/auth/utils/hash.utils';
import { AbstractCrudService } from 'src/shared/database/services/abstract-crud.service';

@Injectable()
export abstract class AbstractUserService extends AbstractCrudService<AbstractUserEntity> {
  private abstractUserRepository: DatabaseAbstractRepository<AbstractUserEntity>;
  constructor(abstractUserRepository: DatabaseAbstractRepository<AbstractUserEntity>) {
    super(abstractUserRepository);
  }

  async save(createUserDto: Partial<AbstractUserEntity>): Promise<AbstractUserEntity> {
    const hashedPassword = createUserDto.password && (await hashPassword(createUserDto.password));
    createUserDto.password = hashedPassword;
    return this.abstractUserRepository.save(createUserDto);
  }

  @Transactional()
  async update(
    id: string,
    updateUserDto: Partial<AbstractUserEntity>,
  ): Promise<AbstractUserEntity | null> {
    return this.abstractUserRepository?.update(id, updateUserDto);
  }

  //Extended Methods ===========================================================================

  async findOneByUsernameOrEmail(
    usernameOrEmail: string,
  ): Promise<AbstractUserEntity | null | undefined> {
    return this.abstractUserRepository.findOne({
      where: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
    });
  }

  async findOneByEmail(
    email: string,
    withDeleted = false,
    query?: Pick<IQueryObject, 'join'>,
  ): Promise<AbstractUserEntity | null | undefined> {
    const queryBuilder = new QueryBuilder(this.abstractUserRepository.getMetadata());
    const queryOptions = query ? queryBuilder.build(query) : {};
    return this.abstractUserRepository.findOne({
      where: { email },
      relations: queryOptions.relations,
      withDeleted,
    });
  }

  async findOneByUsername(
    username: string,
    withDeleted: boolean = false,
    query?: Pick<IQueryObject, 'join'>,
  ): Promise<AbstractUserEntity | null | undefined> {
    const queryBuilder = new QueryBuilder(this.abstractUserRepository.getMetadata());
    const queryOptions = query ? queryBuilder.build(query) : {};
    return this.abstractUserRepository.findOne({
      where: { username },
      relations: queryOptions.relations,
      withDeleted,
    });
  }

  async activate(id: string): Promise<AbstractUserEntity | null | undefined> {
    return this.abstractUserRepository.update(id, { isActive: true });
  }

  async deactivate(id: string): Promise<AbstractUserEntity | null | undefined> {
    return this.abstractUserRepository.update(id, {
      isActive: false,
    });
  }

  async approve(id: string): Promise<AbstractUserEntity | null | undefined> {
    return this.abstractUserRepository.update(id, {
      isApproved: true,
    });
  }

  async disapprove(id: string): Promise<AbstractUserEntity | null | undefined> {
    return this.abstractUserRepository.update(id, {
      isApproved: false,
    });
  }

  async changePassword(
    id: string,
    password: string,
  ): Promise<AbstractUserEntity | null | undefined> {
    const user = await this.findOneById(id);
    const hashedPassword = await hashPassword(password);
    return this.abstractUserRepository.update(id, {
      ...user,
      password: hashedPassword,
    });
  }
}
