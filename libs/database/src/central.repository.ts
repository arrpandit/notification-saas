import { DatabaseService } from './database.service';

export class Centralrepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async getNotificationById(notificationId: string) {
    const res = await this.databaseService.query(
      `SELECT * FROM notifications WHERE id = $1`,
      [notificationId],
    );
    return res.rows[0];
  }

  async updateNotificationStatus(notificationId: string, status: string) {
    await this.databaseService.query(
      `UPDATE notifications SET status = $1 WHERE id = $2`,
      [status, notificationId],
    );
  }
}
