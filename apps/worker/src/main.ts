import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './workers.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(WorkerModule);

  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
  Logger.log(`Worker service is running on: ${await app.getUrl()}`);
}

bootstrap().catch((error) => {
  Logger.error('Failed to start application', error);
  process.exit(1);
});
