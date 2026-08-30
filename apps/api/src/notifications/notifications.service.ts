import { Injectable, Logger } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationsRepository } from './notifications.repository';

@Injectable()
export class NotificationsService {
  private readonly logger: Logger;

  constructor(
    private readonly notificationsRepository: NotificationsRepository,
  ) {
    this.logger = new Logger(NotificationsService.name);
  }

  async createNotification(
    organizationId: string,
    dto: CreateNotificationDto,
  ): Promise<any> {
    return this.notificationsRepository.create(organizationId, dto);
  }
}
