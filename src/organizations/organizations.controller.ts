import { Body, Controller, Post } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { CreateOrganizationDto } from './dto/create-organization.dto';

@Controller('organizations')
export class OrganizationsController {

    constructor(private readonly organizationsService: OrganizationsService) {}
    @Post()
    createOrganization(@Body() createOrganizationDto: CreateOrganizationDto): Promise<any> {
        return this.organizationsService.createOrganization(createOrganizationDto);
        // Here you can implement the logic to handle the creation of an organization
        // For example, you can call a service method to create the organization in the database
    }
}
