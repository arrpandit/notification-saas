import { Injectable } from '@nestjs/common';
import { DatabaseService } from './database.service';

@Injectable()
export class Centralrepository {
  constructor(private readonly databaseService: DatabaseService) {}

  private ensureDatabaseService() {
    if (
      !this.databaseService ||
      typeof this.databaseService.query !== 'function'
    ) {
      throw new Error(
        'Centralrepository requires a configured DatabaseService instance.',
      );
    }
  }

  async getNotificationById(notificationId: string) {
    this.ensureDatabaseService();

    const res = await this.databaseService.query(
      `SELECT * FROM notifications WHERE id = $1`,
      [notificationId],
    );
    return res.rows[0];
  }

  async updateNotificationStatus(notificationId: string, status: string) {
    this.ensureDatabaseService();

    await this.databaseService.query(
      `UPDATE notifications SET status = $1 WHERE id = $2`,
      [status, notificationId],
    );
  }
}
