import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ParentLinkService } from './parent-link.service';
import { Roles } from '../../common/auth/guards';
import { UserRole } from '@qlp/shared';

@ApiTags('parent-links')
@ApiBearerAuth()
@Controller('parent-links')
export class ParentLinkController {
  constructor(private parentLinkService: ParentLinkService) {}

  @Post('children')
  @Roles(UserRole.PARENT)
  createChild(@Req() req: any, @Body() body: any) {
    return this.parentLinkService.createChild(req.user.id, body);
  }

  @Get('children')
  @Roles(UserRole.PARENT)
  getChildren(@Req() req: any) {
    return this.parentLinkService.getChildren(req.user.id);
  }

  @Get('children/:childId/progress')
  @Roles(UserRole.PARENT)
  getChildProgress(@Req() req: any, @Param('childId') childId: string) {
    return this.parentLinkService.getChildProgress(req.user.id, childId);
  }
}
