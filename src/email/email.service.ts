import { Injectable } from '@nestjs/common';

@Injectable()
export class EmailService {
  async sendEmail(to: string, subject: string, body: string): Promise<any> {
    // Here you can implement the logic to send an email using a third-party service or SMTP server.
    // For demonstration purposes, we'll just log the email details to the console.
    console.log(`Sending email to: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body: ${body}`);

    return true;
  }
}
