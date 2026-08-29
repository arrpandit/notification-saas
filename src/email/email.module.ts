import { Module } from '@nestjs/common';
import { EmailService } from './email.service';

@Module({})
export class EmailModule {
  providers: [EmailService];
  exports: [EmailService];
}
