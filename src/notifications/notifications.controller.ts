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
    return this.notificationsService.createNotification(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
      request.organization.id,
      dto,
    );
  }
}
