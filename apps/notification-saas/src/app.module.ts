import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../libs/database/src/database.module';
import { ConfigModule } from '@nestjs/config';
import { EmailModule } from '../../../libs/email/src/email.module';
import { ServiceBusModule } from '../../../libs/service-bus/src/service-bus.module';

@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EmailModule,
    ServiceBusModule,
  ],
})
export class AppModule {}
