import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseModule } from './common/database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ProfileModule } from './modules/profile/profile.module';
import { ParentLinkModule } from './modules/parent-link/parent-link.module';
import { CurriculumModule } from './modules/curriculum/curriculum.module';
import { ProgressModule } from './modules/progress/progress.module';
import { TutorModule } from './modules/tutor/tutor.module';
import { BookingModule } from './modules/booking/booking.module';
import { VideoModule } from './modules/video/video.module';
import { ChatModule } from './modules/chat/chat.module';
import { AchievementModule } from './modules/achievement/achievement.module';
import { AdminModule } from './modules/admin/admin.module';
import { UploadModule } from './modules/upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432'),
      username: process.env.DATABASE_USER || 'qlp',
      password: process.env.DATABASE_PASSWORD || 'qlp_dev',
      database: process.env.DATABASE_NAME || 'qlp',
      autoLoadEntities: true,
      synchronize: false,
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    ProfileModule,
    ParentLinkModule,
    CurriculumModule,
    ProgressModule,
    TutorModule,
    BookingModule,
    VideoModule,
    ChatModule,
    AchievementModule,
    AdminModule,
    UploadModule,
  ],
})
export class AppModule {}
