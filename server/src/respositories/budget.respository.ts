import { Repository } from 'typeorm';
import { Budget } from '../entities/budget.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBudgetDto } from 'src/budget/dto/request.dto';
import { Month } from 'src/utils/enums';

@Injectable()
export class BudgetRepository {
  constructor(
    @InjectRepository(Budget)
    private readonly repository: Repository<Budget>,
  ) {}

  public saveBudget(budget: CreateBudgetDto) {
    return this.repository.save(budget);
  }

  public findCurrentBudget(month: Month, year: number) {
    return this.repository.findOneBy({ month, year });
  }
}
