import { Controller, Get, Patch, Body, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ProfileService } from './profile.service';

@ApiTags('profiles')
@ApiBearerAuth()
@Controller('profiles')
export class ProfileController {
  constructor(private profileService: ProfileService) {}

  @Get('me')
  getMe(@Req() req: any) {
    return this.profileService.findByUserId(req.user.id);
  }

  @Patch('me')
  updateMe(@Req() req: any, @Body() body: Partial<any>) {
    return this.profileService.update(req.user.id, body);
  }
}
