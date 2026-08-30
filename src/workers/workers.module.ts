import { Module } from '@nestjs/common';
import { NotificationWorkerService } from './notification.worker/notification.worker.service';
import { EmailService } from 'src/email/email.service';
import { DatabaseService } from 'src/database/database.service';

@Module({
  providers: [NotificationWorkerService, EmailService, DatabaseService],
})
export class WorkersModule {}
