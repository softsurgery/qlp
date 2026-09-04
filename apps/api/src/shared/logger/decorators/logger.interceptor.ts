import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { tap } from 'rxjs';
import { AdvancedRequest } from 'src/types';
import { LoggerService } from '../services/logger.service';
import { AccessTokenPayload } from 'src/shared/auth/interfaces/access-token-payload.interface';
import { getTokenPayload } from 'src/shared/auth/utils/token-payload';
import { EventType } from 'src/app/enums/event-type.enum';

@Injectable()
export class LogInterceptor implements NestInterceptor {
  constructor(
    private readonly reflector: Reflector,
    private readonly loggerService: LoggerService,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      tap(() => {
        const event = this.reflector.get<EventType>('event', context.getHandler());

        if (!event) return;

        const request: AdvancedRequest = context.switchToHttp().getRequest();
        const { method, url, logInfo } = request;

        if (event === EventType.CLIENT_SIGNIN || event === EventType.ADMIN_SIGNIN) {
          const payload: AccessTokenPayload = getTokenPayload(request);

          void this.loggerService.save({
            event,
            logInfo,
            api: url,
            method,
            userId: payload?.sub,
          });

          return;
        }

        const payload: AccessTokenPayload = getTokenPayload(request);

        void this.loggerService.save({
          event,
          logInfo,
          api: url,
          method,
          userId: payload?.sub,
        });
      }),
    );
  }
}
