import { randomUUID } from 'crypto';
import { Transactional } from '@nestjs-cls/transactional';
import { Injectable, NotFoundException } from '@nestjs/common';
import { DeepPartial, FindManyOptions, FindOneOptions, ObjectLiteral } from 'typeorm';
import { IQueryObject } from 'src/shared/database/interfaces/database-query-options.interface';
import { QueryBuilder } from 'src/shared/database/utils/database-query-builder';
import { PageDto } from 'src/shared/database/dtos/database.page.dto';
import { PageMetaDto } from 'src/shared/database/dtos/database.page-meta.dto';
import { DatabaseVersioningAbstractRepository } from '../repositories/database-versioning.repository';

@Injectable()
export class AbstractVersioningCrudService<T extends ObjectLiteral> {
  repository: DatabaseVersioningAbstractRepository<T>;

  constructor(repository: DatabaseVersioningAbstractRepository<T>) {
    this.repository = repository;
  }

  async findOneById(id: number | string, join?: string): Promise<T> {
    const queryBuilder = new QueryBuilder(this.repository.getMetadata());
    const queryOptions = queryBuilder.build({ join });
    queryOptions.where = { id, isLatest: true };
    const entity = await this.repository.findOne(queryOptions as FindOneOptions<T>);
    if (!entity) {
      throw new NotFoundException(
        `${this.repository.getMetadata().name} with id ${id} is not found`,
      );
    }
    return entity;
  }

  async findOneByVersion(id: number | string, version: number, join?: string): Promise<T> {
    const queryBuilder = new QueryBuilder(this.repository.getMetadata());
    const queryOptions = queryBuilder.build({ join });
    queryOptions.where = { id, version };
    const entity = await this.repository.findOne(queryOptions as FindOneOptions<T>);
    if (!entity) {
      throw new NotFoundException(
        `${this.repository.getMetadata().name} with id ${id} version ${version} is not found`,
      );
    }
    return entity;
  }

  async findAllVersions(id: number | string, query: IQueryObject = {}): Promise<T[]> {
    const queryBuilder = new QueryBuilder(this.repository.getMetadata());
    const queryOptions = queryBuilder.build(query);
    return this.repository.findAllVersions(id, queryOptions as FindManyOptions<T>);
  }

  async findOneByCondition(query: IQueryObject): Promise<T | null> {
    const queryBuilder = new QueryBuilder(this.repository.getMetadata());
    const queryOptions = queryBuilder.build(query);
    const where = queryOptions.where;
    queryOptions.where = Array.isArray(where)
      ? where.map((condition) => ({ ...condition, isLatest: true }))
      : { ...(where || {}), isLatest: true };
    return this.repository.findOne(queryOptions as FindOneOptions<T>);
  }

  async findAll(query: IQueryObject = {}): Promise<T[]> {
    const queryBuilder = new QueryBuilder(this.repository.getMetadata());
    const queryOptions = queryBuilder.build(query);
    return this.repository.findAllLatest(queryOptions as FindManyOptions<T>);
  }

  async findAllPaginated(query: IQueryObject): Promise<PageDto<T>> {
    const queryBuilder = new QueryBuilder(this.repository.getMetadata());
    const queryOptions = queryBuilder.build(query);
    const count = await this.repository.getTotalCountLatest({
      where: queryOptions.where,
    } as FindOneOptions<T>);

    const entities = await this.repository.findAllLatest(queryOptions as FindManyOptions<T>);

    const pageMetaDto = new PageMetaDto({
      pageOptionsDto: {
        page: Number(query.page) || 1,
        take: Number(query.limit) || 10,
      },
      itemCount: count,
    });

    return new PageDto(entities, pageMetaDto);
  }

  @Transactional()
  async save(dto: DeepPartial<T>) {
    const payload = dto as DeepPartial<T> & { id?: string; version?: number };
    return this.repository.save({
      ...dto,
      id: payload.id || randomUUID(),
      version: payload.version ?? 1,
      isLatest: true,
    } as DeepPartial<T>);
  }

  @Transactional()
  async saveNewVersion(id: string | number, dto: DeepPartial<T>) {
    const latest = await this.repository.findOneById(id);
    if (!latest) {
      throw new NotFoundException(
        `${this.repository.getMetadata().name} with id ${id} is not found`,
      );
    }

    const payload = { ...(latest as Record<string, unknown>) };
    delete payload.createdAt;
    delete payload.updatedAt;
    delete payload.deletedAt;
    delete payload.version;
    delete payload.isLatest;

    return this.repository.saveNewVersion({
      ...payload,
      ...dto,
      id,
    } as DeepPartial<T>);
  }

  @Transactional()
  async update(id: string | number, dto: Partial<T>) {
    return this.saveNewVersion(id, dto as DeepPartial<T>);
  }

  async softDelete(id: string | number): Promise<T | null> {
    return this.repository.softDelete(id);
  }
}
