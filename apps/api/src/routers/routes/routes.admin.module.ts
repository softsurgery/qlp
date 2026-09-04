import { Module } from '@nestjs/common';
import { AuthModule } from 'src/shared/auth/auth.module';
import { AuthController } from 'src/shared/auth/controllers/auth.controller';
import { LoggerModule } from 'src/shared/logger/logger.module';
import { NotificationModule } from 'src/shared/notifications/notifications.module';

@Module({
  controllers: [AuthController],
  providers: [],
  exports: [],
  imports: [AuthModule, NotificationModule, LoggerModule],
})
export class RoutesAdminModule {}
