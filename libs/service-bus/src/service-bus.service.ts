import { ServiceBusClient, ServiceBusSender } from '@azure/service-bus';
import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ServiceBusService implements OnModuleInit, OnModuleDestroy {
  logger = new Logger(ServiceBusService.name);
  constructor(private readonly configService: ConfigService) {}

  private client!: ServiceBusClient;
  private sender!: ServiceBusSender;

  onModuleInit() {
    // const connectionString = process.env.AZURE_SERVICE_BUS_CONNECTION_STRING;
    // const queueName = process.env.AZURE_SERVICE_BUS_QUEUE;

    const connectionString = this.configService.get<string>(
      'AZURE_SERVICE_BUS_CONNECTION_STRING',
    );

    const queueName = this.configService.get<string>('AZURE_SERVICE_BUS_QUEUE');

    if (!connectionString) {
      this.logger.warn(
        'AZURE_SERVICE_BUS_CONNECTION_STRING is not defined in the environment variables.',
      );
      return;
    }

    if (!queueName) {
      this.logger.warn(
        'AZURE_SERVICE_BUS_QUEUE is not defined in the environment variables.',
      );
      return;
    }

    try {
      this.client = new ServiceBusClient(connectionString);
      this.sender = this.client.createSender(queueName);
      this.logger.log(`Azure Service Bus connected to queue: ${queueName}`);
    } catch (error) {
      this.logger.error(`Failed to connect to Azure Service Bus:`, error);
    }
  }

  async sendNotificationMessage(notificationId: string): Promise<void> {
    await this.sender.sendMessages({
      body: {
        notificationId,
      },
      contentType: 'application/json',
    });
  }

  async onModuleDestroy() {
    await this.sender?.close();
    await this.client?.close();
  }
}
