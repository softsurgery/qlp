import { Controller, Get, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AchievementService } from './achievement.service';
import { Public } from '../../common/auth/guards';

@ApiTags('achievements')
@Controller('achievements')
export class AchievementController {
  constructor(private achievementService: AchievementService) {}

  @Public()
  @Get()
  findAll() {
    return this.achievementService.findAll();
  }

  @Get('me')
  myAchievements(@Req() req: any) {
    return this.achievementService.getUserAchievements(req.user.id);
  }
}
