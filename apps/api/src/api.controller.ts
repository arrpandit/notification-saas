import { Controller, Get } from '@nestjs/common';
import { ApiService } from './api.service';

@Controller('health')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Get()
  getHealth(): any {
    return {
      status: 200,
      message: 'Health is OK',
    };
  }
}
