import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Pool, QueryResultRow } from 'pg';

@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  logger = new Logger(DatabaseService.name);
  private readonly pool: Pool;
  constructor(private readonly configService: ConfigService) {
    this.pool = new Pool({
      host: this.configService.get<string>('DB_HOST'),
      port: this.configService.get<number>('DB_PORT'),
      user: this.configService.get<string>('DB_USER'),
      password: this.configService.get<string>('DB_PASSWORD'),
      database: this.configService.get<string>('DB_NAME'),
    });
  }

  async onModuleInit() {
    await this.pool.query('SELECT 1');
    this.logger.log('Database connection established successfully.');
  }

  async onModuleDestroy() {
    await this.pool.end();
    this.logger.log('Database connection closed successfully.');
  }

  async getClient() {
    return await this.pool.connect();
  }

  async query<T extends QueryResultRow>(text: string, params: unknown[] = []) {
    return this.pool.query<T>(text, params);
  }
}
