import { Controller, Headers, HttpCode, Post, Req } from '@nestjs/common';
import { RawBodyRequest } from '@nestjs/common';
import { Request } from 'express';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/shared/auth/utils/public-strategy';
import { MediaWebhookService, WebhookHandlingResult } from '../services/media-webhook.service';
import { MediaWebhookBodyException } from '../errors/media.errors';

@ApiTags('media')
@Controller({ version: '1', path: '/media/webhooks' })
export class MediaWebhookController {
  constructor(private readonly webhookService: MediaWebhookService) {}

  @Public()
  @Post()
  @HttpCode(200)
  @ApiExcludeEndpoint()
  async receive(
    @Req() request: RawBodyRequest<Request>,
    @Headers('authorization') authorization?: string,
    @Headers('authorize') authorize?: string,
  ): Promise<WebhookHandlingResult> {
    if (!request.rawBody) {
      throw new MediaWebhookBodyException();
    }

    return this.webhookService.handle(request.rawBody.toString('utf8'), authorization ?? authorize);
  }
}
