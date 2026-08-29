import { Module } from '@nestjs/common';
import { NotificationWorkerService } from './notification.worker/notification.worker.service';

@Module({
  providers: [NotificationWorkerService]
})
export class WorkersModule {}
