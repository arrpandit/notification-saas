import { Body, Controller, Post, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  create(@Req() request: any, @Body() dto: CreateNotificationDto) {
    return this.notificationsService.create(request.organization.id, dto);
  }
}
