import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { TutorModule } from '../tutor/tutor.module';
import { VideoModule } from '../video/video.module';
import { AchievementModule } from '../achievement/achievement.module';
import { ChatModule } from '../chat/chat.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking]),
    TutorModule,
    VideoModule,
    AchievementModule,
    forwardRef(() => ChatModule),
  ],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}
