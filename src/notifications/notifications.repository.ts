import { Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { EmailService } from 'src/email/email.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { ServiceBusService } from 'src/service-bus/service-bus.service';

@Injectable()
export class NotificationsRepository {
  private readonly logger: Logger;

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly emailService: EmailService,
    private readonly serviceBusService?: ServiceBusService,
  ) {
    this.logger = new Logger(NotificationsRepository.name);
  }

  async create(organizationId: string, dto: CreateNotificationDto) {
    const result = await this.databaseService.query(
      `
      INSERT INTO notifications (
        organization_id,
        user_id,
        type,
        channel,
        recipient,
        subject,
        message,
        status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'PENDING')
      RETURNING *
      `,
      [
        organizationId,
        dto.userId,
        dto.type,
        dto.channel,
        dto.recipient,
        dto.subject ?? null,
        dto.message,
      ],
    );

    const notification = result.rows[0];

    if (this.serviceBusService) {
      this.logger.log(
        `Sending notification message for notification ID: ${notification.id}`,
      );
      await this.serviceBusService.sendNotificationMessage(notification.id);
    }

    return {
      ...notification,
      status: 'PENDING',
    };

    // try {
    //   if (dto.channel === 'EMAIL') {
    //     await this.emailService.sendEmail(
    //       dto.recipient,
    //       dto.subject ?? 'Notification',
    //       dto.message,
    //     );
    //   }

    //   await this.databaseService.query(
    //     `
    //     UPDATE notifications
    //     SET status = 'SENT'
    //     WHERE id = $1
    //     `,
    //     [notification.id],
    //   );

    //   return {
    //     ...notification,
    //     status: 'SENT',
    //   };
    // } catch (error) {
    //   await this.databaseService.query(
    //     `
    //     UPDATE notifications
    //     SET status = 'FAILED'
    //     WHERE id = $1
    //     `,
    //     [notification.id],
    //   );

    //   throw error;
    // }
  }
}
