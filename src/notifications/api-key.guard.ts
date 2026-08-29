import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { OrganizationsService } from 'src/organizations/organizations.service';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly organizationsService: OrganizationsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const apiKey = request.headers['x-api-key'];
    if (!apiKey) {
      throw new UnauthorizedException('API key is missing');
    }

    const organization =
      await this.organizationsService.findOrganizationByApiKey(apiKey);

    if (!organization) {
      throw new UnauthorizedException('Invalid API key');
    }

    request.organization = organization; // Attach the organization to the request object for further use in the controller
    return true; // Return true if the organization exists, false otherwise
  }
}
