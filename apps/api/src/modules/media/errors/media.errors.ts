import { HttpException, HttpStatus } from '@nestjs/common';

export class MediaRoomNotFoundException extends HttpException {
  constructor(roomId?: string) {
    super(roomId ? `Media room ${roomId} not found` : 'Media room not found', HttpStatus.NOT_FOUND);
  }
}

export class MediaRoomClosedException extends HttpException {
  constructor() {
    super('This session has already ended', HttpStatus.CONFLICT);
  }
}

export class MediaAccessDeniedException extends HttpException {
  constructor(message = 'You are not authorized to join this session') {
    super(message, HttpStatus.FORBIDDEN);
  }
}

export class MediaRoleEscalationException extends HttpException {
  constructor(requested: string, granted: string) {
    super(
      `Cannot join as "${requested}" - this account is authorized as "${granted}" for this session`,
      HttpStatus.FORBIDDEN,
    );
  }
}

export class MediaRoomManagementDeniedException extends HttpException {
  constructor(message = 'You can only manage sessions you host') {
    super(message, HttpStatus.FORBIDDEN);
  }
}

export class MediaHostAssignmentDeniedException extends HttpException {
  constructor(message = 'Only administrators can assign the host of a session') {
    super(message, HttpStatus.FORBIDDEN);
  }
}

export class MediaInviteDeniedException extends HttpException {
  constructor(message = 'Hosts can only invite students') {
    super(message, HttpStatus.FORBIDDEN);
  }
}

export class MediaRoomNotOpenException extends HttpException {
  constructor(opensAt: Date) {
    super(
      {
        statusCode: 425,
        error: 'Too Early',
        message: `This session opens at ${opensAt.toISOString()}`,
        opensAt: opensAt.toISOString(),
      },
      425,
    );
  }
}

export class MediaRoomCapacityException extends HttpException {
  constructor(capacity: number) {
    super(`This session is limited to ${capacity} participant(s)`, HttpStatus.CONFLICT);
  }
}

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

export class MediaWebhookSignatureException extends HttpException {
  constructor() {
    super('Invalid webhook signature', HttpStatus.UNAUTHORIZED);
  }
}

export class MediaWebhookBodyException extends HttpException {
  constructor() {
    super('Webhook raw body unavailable', HttpStatus.BAD_REQUEST);
  }
}
