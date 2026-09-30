import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { AuthGuard } from './guards/auth.guard';
import { AuthService } from './services/auth.service';
import { MailModule } from '../mail/mail.module';
import { ClientAuthService } from './services/client-auth.service';
import { StorageModule } from '../storage/storage.module';
import { AuthProvidersService } from './services/auth-provider.service';
import { ConfigurationsModule } from '../configurations/configurations.module';
import { UserManagementModule } from 'src/modules/user-management/user-management.module';

@Module({
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    AuthService,
    ClientAuthService,
    AuthProvidersService,
  ],
  exports: [AuthService, ClientAuthService, AuthProvidersService],
  imports: [UserManagementModule, ConfigModule, MailModule, StorageModule, ConfigurationsModule],
})
export class AuthModule {}
