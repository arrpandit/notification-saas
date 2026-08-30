import { DatabaseService } from '@app/database';
import { EmailService } from '@app/email';
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

      processError: (error) => {
        this.logger.error('Azure service bus error', error);
        return Promise.resolve();
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
          notification.recipient as string,
          (notification.subject ?? 'Notification') as string,
          notification.message as string,
        );
      }

      await this.databaseService.query(
        `UPDATE notifications SET status = 'SENT', processed_at = NOW(), last_error = NULL
        WHERE id = $1`,
        [notificationId],
      );

      await this.receiver.completeMessage(message);

      this.logger.log(`Notification ${notificationId} SENT`);
    } catch (error) {
      const errorMessage = (error as Error).message || 'Unknown error';

      this.logger.error(
        `Failed to process notification ${notificationId}: ${errorMessage}`,
      );

      await this.databaseService.query(
        `UPDATE notifications SET status = 'FAILED' , last_error = $2, processed_at = NOW() WHERE id =$1`,
        [notificationId, errorMessage],
      );

      const MAX_RETRIES = 5;
      if (message.deliveryCount ?? 0 >= MAX_RETRIES) {
        await this.receiver.deadLetterMessage(message, {
          deadLetterReason: 'Max retries exceeded',
          deadLetterErrorDescription: `Notification ${notificationId} failed after ${MAX_RETRIES} attempts.`,
        });

        this.logger.log(
          `Notification ${notificationId} moved to dead-letter queue after ${MAX_RETRIES} attempts.`,
        );

        return;
      }

      await this.receiver.abandonMessage(message);

      throw error;
    }
  }

  async onModuleDestroy() {
    await this.receiver?.close();
    await this.client?.close();
  }
}
