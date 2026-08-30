import { Test, TestingModule } from '@nestjs/testing';
import { Centralrepository } from './central.repository';
import { DatabaseService } from './database.service';

describe('DatabaseService', () => {
  let service: DatabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DatabaseService],
    }).compile();

    service = module.get<DatabaseService>(DatabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

describe('Centralrepository', () => {
  it('should resolve the database service and query by notification id', async () => {
    const query = jest.fn().mockResolvedValue({ rows: [{ id: 'abc' }] });

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Centralrepository,
        {
          provide: DatabaseService,
          useValue: { query },
        },
      ],
    }).compile();

    const repository = module.get(Centralrepository);
    const result = await repository.getNotificationById('abc');

    expect(result).toEqual({ id: 'abc' });
    expect(query).toHaveBeenCalledWith(
      'SELECT * FROM notifications WHERE id = $1',
      ['abc'],
    );
  });
});
