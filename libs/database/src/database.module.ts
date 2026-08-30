import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.service';
import { Centralrepository } from './central.repository';

@Global()
@Module({
  providers: [DatabaseService, Centralrepository],
  exports: [DatabaseService, Centralrepository],
})
export class DatabaseModule {}
