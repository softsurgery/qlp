import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MediaTokenService } from './services/media-token.service';

@Module({
  providers: [
    MediaTokenService,
  ],
  exports: [
    MediaTokenService,
  ],
  imports: [
    ConfigModule,
  ],
})
export class MediaModule {}
