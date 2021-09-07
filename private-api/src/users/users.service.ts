import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Nutrient } from '../nutrients/entities/nutrient.entity';
import { getManager, getRepository } from 'typeorm';
//select t.nutrient_id, sum(t.Total) as Total from (select a.food_id, (a.servings_per_week * b.amount_per_serving) as Total, b.nutrient_id from user_foods a join food_nutrients b on a.food_id = b.food_id where a.user_id=1) as t group by t.nutrient_id order by Total desc limit 0,1;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  create(createUserDto: CreateUserDto) {
    return this.usersRepository.save(createUserDto);
  }

  findAll(skip = 0, take = 25) {
    return this.usersRepository.find({
      skip,
      take,
    });
  }

  async findOne(id: number): Promise<User> {
    try {
      const user = await this.usersRepository.findOneOrFail(id);
      return user;
    } catch (err) {
      throw new NotFoundException(`User ID ${id} not found`);
    }
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.usersRepository.update({ id }, updateUserDto);
    return this.usersRepository.findOneOrFail(id);
  }

  remove(id: number) {
    return this.usersRepository.delete({ id });
  }

  async mostConsumedNutrient(id: number) {
    const entityManager = getManager();
    try {
      let queryData = await entityManager.query(
        `select n.id,n.name,n.unit_name, sum(t.Total) as weeklyAmount from (select a.food_id, (a.servings_per_week * b.amount_per_serving) as Total, b.nutrient_id from user_foods a join food_nutrients b on a.food_id = b.food_id where a.user_id= ${id} ) as t JOIN  nutrients as n on n.id = t.nutrient_id  group by t.nutrient_id order by weeklyAmount desc limit 0,1`,
      );
      if (queryData.length != 0) {
        queryData = queryData[0];
      }
      return queryData;
    } catch (err) {
      throw new NotFoundException(`Data not found for ${id}`);
    }
  }
}
