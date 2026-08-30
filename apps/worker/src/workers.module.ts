import { Module } from '@nestjs/common';
import { NotificationWorkerService } from './notification.worker/notification.worker.service';
import { WorkerService } from './worker.service';
import { WorkerController } from './worker.controller';
import { EmailService } from '@app/email';
import { ConfigModule } from '@nestjs/config';
import { Centralrepository } from '@app/database/central.repository';
import { DatabaseService } from '@app/database';

@Module({
  providers: [
    NotificationWorkerService,
    EmailService,
    DatabaseService,
    WorkerService,
    Centralrepository,
  ],
  controllers: [WorkerController],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class WorkerModule {}
