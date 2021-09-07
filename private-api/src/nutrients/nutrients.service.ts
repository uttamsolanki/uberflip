import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNutrientDto } from './dto/create-nutrient.dto';
import { UpdateNutrientDto } from './dto/update-nutrient.dto';
import { Nutrient } from './entities/nutrient.entity';
@Injectable()
export class NutrientsService {
  constructor(
    @InjectRepository(Nutrient)
    private nutrientsRepository: Repository<Nutrient>,
  ) {}

  create(createNutrientDto: CreateNutrientDto) {
    return this.nutrientsRepository.save(createNutrientDto);
  }

  findAll() {
    return this.nutrientsRepository.find();
  }

  findOne(id: number) {
    return this.nutrientsRepository.findOneOrFail(id);
  }

  async update(id: number, updateNutrientDto: UpdateNutrientDto) {
    await this.nutrientsRepository.update({ id }, updateNutrientDto);
    return this.nutrientsRepository.findOneOrFail(id);
  }

  remove(id: number) {
    return this.nutrientsRepository.delete({ id });
  }
}
