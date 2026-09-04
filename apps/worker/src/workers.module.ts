import { Module } from '@nestjs/common';
import { NotificationWorkerService } from './notification.worker/notification.worker.service';
import { WorkerService } from './worker.service';
import { WorkerController } from './worker.controller';
import { EmailModule } from '@app/email';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@app/database';

@Module({
  providers: [
    NotificationWorkerService,
    WorkerService,
  ],
  controllers: [WorkerController],
  imports: [
    DatabaseModule,
    EmailModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class WorkerModule {}
