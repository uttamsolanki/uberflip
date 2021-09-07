import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
//import { request } from 'express';
import { Food } from './entities/food.entity';
import { FoodsController } from './foods.controller';
import { FoodsService } from './foods.service';
import * as req from 'supertest';
const mockRepository = jest.fn(() => ({
  metadata: {
    columns: [],
    relations: [],
  },
}));

describe('FoodsController', () => {
  let app: INestApplication;
  let controller: FoodsController;
  let DTO = {
    id: 1,
    description: 'Test Description',
    publicationDate: '2020-11-01T00:00:00.000Z',
  };
  const mockFoodService = {
    findAll: jest.fn((dto) => {
      return [
        {
          id: 394823,
          description: "BRASWELL'S SELECT, RED PEPPER JELLY",
          publicationDate: '2020-11-01T00:00:00.000Z',
        },
      ];
    }),
    create: jest.fn((dto) => {
      return {
        ...dto,
        id: Date.now(),
      };
    }),
    update: jest.fn((id, dto) => {
      return {
        ...dto,
        id,
      };
    }),
    findOne: jest.fn((id) => {
      return {
        id,
        ...DTO,
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FoodsController],
      providers: [
        FoodsService,
        { provide: getRepositoryToken(Food), useClass: mockRepository },
      ],
    })
      .overrideProvider(FoodsService)
      .useValue(mockFoodService)
      .compile();

    controller = module.get<FoodsController>(FoodsController);
    // app = module.createNestApplication();
    // await app.init();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('Should create food', async () => {
    const mockDate = new Date('2020-11-01T00:00:00.000Z');
    const dto = {
      description: 'Test Description',
      publicationDate: '2020-11-01T00:00:00.000Z',
    };
    expect(controller.create(dto)).toEqual({
      id: expect.any(Number),
      description: 'Test Description',
      publicationDate: '2020-11-01T00:00:00.000Z',
    });
  });

  it('Should return food', async () => {
    const mockDate = new Date('2020-11-01T00:00:00.000Z');
    const dto = {
      description: 'Test Description',
      publicationDate: '2020-11-01T00:00:00.000Z',
    };
    expect(controller.findOne(1)).toEqual({
      id: 1,
      description: 'Test Description',
      publicationDate: '2020-11-01T00:00:00.000Z',
    });
  });
});
