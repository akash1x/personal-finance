import { Repository } from 'typeorm';
import { Budget } from 'src/entities/budget.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBudgetDto } from 'src/v1/budget/dto/request.dto';
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

  public findBudget(userId: string, month: Month, year: number) {
    return this.repository.findOneBy({
      user: { id: userId },
      month,
      year,
    });
  }

  public async updateBudget(userId: string, budget: CreateBudgetDto) {
    return this.repository.update(
      {
        user: { id: userId },
        month: budget.month,
        year: budget.year,
      },
      {
        amount: budget.amount,
        currency: budget.currency,
      },
    );
  }
}
