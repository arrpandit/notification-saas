import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './workers.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(WorkerModule);
  await app.listen(process.env.port ?? 3001);
  Logger.log(`Worker service is running on: ${await app.getUrl()}`);
}

bootstrap().catch((error) => {
  Logger.error('Failed to start application', error);
  process.exit(1);
});
