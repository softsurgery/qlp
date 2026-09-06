import { Module } from '@nestjs/common';
import { AuthModule } from 'src/shared/auth/auth.module';
import { ClientAuthController } from 'src/shared/auth/controllers/client-auth.controller';
import { LoggerModule } from 'src/shared/logger/logger.module';
import { NotificationModule } from 'src/shared/notifications/notifications.module';
import { StorageController } from 'src/shared/storage/controllers/storage.controller';
import { StorageModule } from 'src/shared/storage/storage.module';

@Module({
  controllers: [ClientAuthController, StorageController],
  providers: [],
  exports: [],
  imports: [AuthModule, NotificationModule, LoggerModule, StorageModule],
})
export class RoutesModule {}
