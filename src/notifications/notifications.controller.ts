import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { ApiKeyGuard } from './api-key.guard';

@Controller('notifications')
@UseGuards(ApiKeyGuard)
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Post()
  create(@Req() request: any, @Body() dto: CreateNotificationDto) {
    return this.notificationsService.create(request.organization.id, dto);
  }
}
