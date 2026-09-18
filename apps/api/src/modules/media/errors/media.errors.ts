import { HttpException, HttpStatus } from '@nestjs/common';

export class MediaNotConfiguredException extends HttpException {
  constructor() {
    super('Media service is not configured', HttpStatus.SERVICE_UNAVAILABLE);
  }
}
