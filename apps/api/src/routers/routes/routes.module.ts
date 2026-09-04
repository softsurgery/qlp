import { Module } from '@nestjs/common';
import { AuthModule } from 'src/shared/auth/auth.module';
import { ClientAuthController } from 'src/shared/auth/controllers/client-auth.controller';
import { LoggerModule } from 'src/shared/logger/logger.module';
import { NotificationModule } from 'src/shared/notifications/notifications.module';

@Module({
  controllers: [ClientAuthController],
  providers: [],
  exports: [],
  imports: [AuthModule, NotificationModule, LoggerModule],
})
export class RoutesModule {}
