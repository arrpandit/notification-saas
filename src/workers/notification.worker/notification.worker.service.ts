import {
  ServiceBusClient,
  ServiceBusReceivedMessage,
  ServiceBusReceiver,
} from '@azure/service-bus';
import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from 'src/database/database.service';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class NotificationWorkerService
  implements OnModuleInit, OnModuleDestroy
{
  logger = new Logger(NotificationWorkerService.name);
  private client!: ServiceBusClient;
  private receiver!: ServiceBusReceiver;
  constructor(
    private readonly configsService: ConfigService,
    private readonly databaseService: DatabaseService,
    private readonly emailService: EmailService,
  ) {}

  onModuleInit() {
    const connectionString: string | undefined =
      this.configsService.get<string>('AZURE_SERVICE_BUS_CONNECTION_STRING');

    const queueName: string | undefined = this.configsService.get<string>(
      'AZURE_SERVICE_BUS_QUEUE',
    );

    if (!connectionString || !queueName) {
      throw new Error(
        'AZURE_SERVICE_BUS_CONNECTION_STRING and AZURE_SERVICE_BUS_QUEUE must be defined in the environment variables.',
      );
    }

    // Connect to Service Bus
    this.client = new ServiceBusClient(connectionString);

    // Create a receiver for the specified queue
    this.receiver = this.client.createReceiver(queueName);

    // start listening for messages
    this.receiver.subscribe({
      processMessage: async (message: ServiceBusReceivedMessage) => {
        await this.processMessage(message);
      },

      processError: async (error) => {
        this.logger.error('Azure service bus error', error);
      },
    });

    this.logger.log(`Worker listening to queue: ${queueName}`);
  }

  private async processMessage(message: ServiceBusReceivedMessage) {
    const { notificationId } = message.body as { notificationId: string };
    // Process the notification message

    this.logger.log(`Processing notification ID: ${notificationId}`);

    const res = await this.databaseService.query(
      `SELECT * FROM notifications WHERE id = $1`,
      [notificationId],
    );

    const notification = res.rows[0];
    if (!notification) {
      this.logger.error(`Notification with ID ${notificationId} not found.`);
      return;
    }

    try {
      await this.databaseService.query(
        `UPDATE notifications SET status = 'PROCESSING' , attempt_count = attempt_count + 1 WHERE id = $1`,
        [notificationId],
      );
      this.logger.log(`Notification ${notificationId} PROCESSING`);

      if (notification.channel === 'Email') {
        await this.emailService.sendEmail(
          notification.recipient,
          notification.subject ?? 'Notification',
          notification.message,
        );
      }

      await this.databaseService.query(
        `UPDATE notifications SET status = 'SENT' WHERE id = $1`,
        [notificationId],
      );

      this.logger.log(`Notification ${notificationId} SENT`);
    } catch (error) {
      const errorMessage = (error as Error).message || 'Unknown error';
      await this.databaseService.query(
        `UPDATE notifications SET status = 'FAILED' , last_error = $2 WHERE id =$1`,
        [notificationId, errorMessage],
      );
      this.logger.error('Error occurred while processing notification:', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.receiver?.close();
    await this.client?.close();
  }
}
