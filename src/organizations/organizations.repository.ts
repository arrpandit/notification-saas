import { Injectable } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class OrganizationsRepository {
  constructor(private readonly databaseService: DatabaseService) {} // Assuming you have a DatabaseService to handle database operations

  async create(dto: CreateOrganizationDto): Promise<any> {
    const apiKey =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);

    const res = await this.databaseService.query(
      `INSERT INTO organizations (name, api_key) VALUES ($1, $2)`,
      [dto.name, apiKey],
    );

    return res.rows[0];
  }

  async findByApiKey(apiKey: string): Promise<any> {
    const res = await this.databaseService.query(
      `SELECT * FROM organizations WHERE api_key = $1`,
      [apiKey],
    );

    return res.rows[0];
  }
}
