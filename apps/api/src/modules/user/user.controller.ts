import { Controller, Get, Param, Patch, Body, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from './user.service';

@ApiTags('users')
@ApiBearerAuth()
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('me')
  me(@Req() req: any) {
    return this.userService.findById(req.user.id).then((u) => this.userService.toPublic(u));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findById(id).then((u) => this.userService.toPublic(u));
  }

  @Patch('me')
  updateMe(@Req() req: any, @Body() body: { firstName?: string; lastName?: string; avatarUrl?: string }) {
    return this.userService.update(req.user.id, body).then((u) => this.userService.toPublic(u));
  }
}
