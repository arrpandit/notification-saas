import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { ConfigModule } from '@nestjs/config';
import { NotificationsModule } from './notifications/notifications.module';
import { EmailModule } from './email/email.module';
import { ServiceBusModule } from './service-bus/service-bus.module';
import { WorkersModule } from './workers/workers.module';
// import { ServiceBusModule } from './service-bus/service-bus.module';
// import { WorkersModule } from './workers/workers.module';

@Module({
  imports: [
    DatabaseModule,
    OrganizationsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    NotificationsModule,
    EmailModule,
    ServiceBusModule,
    WorkersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
