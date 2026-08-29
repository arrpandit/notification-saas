import { Module } from '@nestjs/common';
import { NotificationsController } from './notifications.controller';
import { NotificationsService } from './notifications.service';
import { ApiKeyGuard } from './api-key.guard';
import { EmailModule } from 'src/email/email.module';
import { OrganizationsModule } from 'src/organizations/organizations.module';

@Module({
  imports: [OrganizationsModule, EmailModule],
  controllers: [NotificationsController],
  providers: [NotificationsService, ApiKeyGuard],
})
export class NotificationsModule {}
