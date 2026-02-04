import { Repository } from 'typeorm';
import { Budget } from 'src/entities/budget.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateBudgetDto } from 'src/budget/dto/request.dto';

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

  public findBudget(userId: string) {
    return this.repository.findOneBy({
      user: { id: userId },
    });
  }

  public async upsertBudget(userId: string, budget: CreateBudgetDto) {
    const existingBudget = await this.findBudget(userId);

    return this.repository.save({
      ...existingBudget,
      ...budget,
      user: { id: userId },
    });
  }
}
