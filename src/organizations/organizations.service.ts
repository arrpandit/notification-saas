import { Injectable } from '@nestjs/common';
import { OrganizationsRepository } from './organizations.repository';
import { CreateOrganizationDto } from './dto/create-organization.dto';

@Injectable()
export class OrganizationsService {
  constructor(
    private readonly organizationsRepository: OrganizationsRepository,
  ) {}

  async createOrganization(dto: CreateOrganizationDto): Promise<any> {
    // Here you can add any business logic before creating the organization
    return await this.organizationsRepository.create(dto);
  }

  async findOrganizationByApiKey(apiKey: string): Promise<any> {
    return await this.organizationsRepository.findByApiKey(apiKey);
  }
}
