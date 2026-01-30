import { Inject, Injectable } from '@nestjs/common';
import { BudgetRepository } from 'src/respositories/budget.respository';
import { CreateBudgetDto } from './dto/request.dto';
import { Month } from 'src/utils/enums';

@Injectable()
export class BudgetService {
  constructor(
    @Inject(BudgetRepository) private budgetRepository: BudgetRepository,
  ) {}
  async create(createBudgetDto: CreateBudgetDto) {
    return this.budgetRepository.saveBudget(createBudgetDto);
  }

  async getCurrentBudget(month: Month, year: number) {
    return this.budgetRepository.findCurrentBudget(month, year);
  }
}
