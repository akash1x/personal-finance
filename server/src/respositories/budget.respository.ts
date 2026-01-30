import { Repository } from 'typeorm';
import { Budget } from 'src/entities/budget.entity';
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

  public saveBudget(userId: string, budget: CreateBudgetDto) {
    return this.repository.save({
      ...budget,
      user: { id: userId },
    });
  }

  public findCurrentBudget(userId: string, month: Month, year: number) {
    return this.repository.findOneBy({
      user: { id: userId },
      month,
      year,
    });
  }
}
