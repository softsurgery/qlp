import { Controller, Get, Post, Patch, Body, Param, Req } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { BookingService } from './booking.service';

@ApiTags('bookings')
@ApiBearerAuth()
@Controller('bookings')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @Get('me')
  myBookings(@Req() req: any) {
    return this.bookingService.findForUser(req.user.id, req.user.role);
  }

  @Post()
  create(@Req() req: any, @Body() body: any) {
    return this.bookingService.create(req.user.id, body);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingService.findById(id);
  }

  @Patch(':id/confirm')
  confirm(@Req() req: any, @Param('id') id: string) {
    return this.bookingService.confirm(id, req.user.id);
  }

  @Patch(':id/cancel')
  cancel(@Req() req: any, @Param('id') id: string) {
    return this.bookingService.cancel(id, req.user.id);
  }

  @Post(':id/start')
  start(@Req() req: any, @Param('id') id: string) {
    return this.bookingService.startSession(id, req.user.id);
  }

  @Post(':id/complete')
  complete(@Param('id') id: string) {
    return this.bookingService.completeSession(id);
  }
}
