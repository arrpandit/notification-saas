import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { ApiKeyGuard } from './api-key.guard';
import { EmailModule } from '@app/email';
import { OrganizationsModule } from '../organizations/organizations.module';
import { NotificationsRepository } from './notifications.repository';

@Module({
  imports: [OrganizationsModule, EmailModule],
  controllers: [NotificationsController],
  providers: [NotificationsService, ApiKeyGuard, NotificationsRepository],
})
export class NotificationsModule {}
