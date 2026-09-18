import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterTypeOrm } from '@nestjs-cls/transactional-adapter-typeorm';
import { DatabaseAbstractRepository } from 'src/shared/database/repositories/database.repository';
import { MediaWebhookEventEntity } from '../entities/media-webhook-event.entity';

@Injectable()
export class MediaWebhookEventRepository extends DatabaseAbstractRepository<MediaWebhookEventEntity> {
  constructor(
    @InjectRepository(MediaWebhookEventEntity)
    private readonly webhookEventRepository: Repository<MediaWebhookEventEntity>,
    txHost: TransactionHost<TransactionalAdapterTypeOrm>,
  ) {
    super(webhookEventRepository, txHost);
  }
}
