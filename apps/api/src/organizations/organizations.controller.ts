import { Body, Controller, Get, Post } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}
  @Post()
  createOrganization(
    @Body() createOrganizationDto: CreateOrganizationDto,
  ): Promise<any> {
    return this.organizationsService.createOrganization(createOrganizationDto);
    // Here you can implement the logic to handle the creation of an organization
    // For example, you can call a service method to create the organization in the database
  }

  @Get()
  getAllOrganizations(): Promise<any[]> {
    const res = this.organizationsService.getAllOrganizations();

    console.log('Organizations:', res); // Log the organizations to the console
    return res;
    // Here you can implement the logic to retrieve all organizations
    // For example, you can call a service method to fetch the organizations from the database
  }
}
