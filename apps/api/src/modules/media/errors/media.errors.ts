import { HttpException, HttpStatus } from '@nestjs/common';

export class MediaNotConfiguredException extends HttpException {
  constructor() {
    super('Media service is not configured', HttpStatus.SERVICE_UNAVAILABLE);
  }
}

export class MediaParticipantConflictException extends HttpException {
  constructor() {
    super('This user is already enrolled in the session', HttpStatus.CONFLICT);
  }
}
