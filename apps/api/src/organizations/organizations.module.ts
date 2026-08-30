import { Module } from '@nestjs/common';
import { OrganizationsService } from './organizations.service';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsRepository } from './organizations.repository';
import { DatabaseModule } from '@app/database';

@Module({
  imports: [DatabaseModule],
  providers: [OrganizationsService, OrganizationsRepository],
  controllers: [OrganizationsController],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}
