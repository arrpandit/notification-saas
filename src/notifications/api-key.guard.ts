/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const apiKey: string = request.headers['x-api-key'];
    if (!apiKey) {
      throw new UnauthorizedException('API key is missing');
    }

    const organization =
      await this.organizationsService.findOrganizationByApiKey(apiKey);

    if (!organization) {
      throw new UnauthorizedException('Invalid API key');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    request.organization = organization; // Attach the organization to the request object for further use in the controller
    return true; // Return true if the organization exists, false otherwise
  }
}
