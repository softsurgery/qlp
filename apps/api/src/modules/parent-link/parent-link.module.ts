import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ParentChildLink } from './entities/parent-child-link.entity';
import { ParentLinkService } from './parent-link.service';
import { ParentLinkController } from './parent-link.controller';
import { UserModule } from '../user/user.module';
import { ProgressModule } from '../progress/progress.module';
import { AchievementModule } from '../achievement/achievement.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ParentChildLink]),
    UserModule,
    ProgressModule,
    AchievementModule,
  ],
  controllers: [ParentLinkController],
  providers: [ParentLinkService],
  exports: [ParentLinkService],
})
export class ParentLinkModule {}
