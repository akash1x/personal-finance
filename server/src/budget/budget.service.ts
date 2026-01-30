import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { BudgetRepository } from 'src/respositories/budget.respository';
import { CreateBudgetDto } from './dto/request.dto';
import { Month } from 'src/utils/enums';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class BudgetService {
  constructor(
    @Inject(BudgetRepository) private budgetRepository: BudgetRepository,
    @Inject(UsersService) private usersService: UsersService,
  ) {}
  async create(userId: string, createBudgetDto: CreateBudgetDto) {
    await this.usersService.userExists(userId);
    return this.budgetRepository.saveBudget(userId, createBudgetDto);
  }

  async getCurrentBudget(userId: string, month: Month, year: number) {
    await this.usersService.userExists(userId);
    const budget = await this.budgetRepository.findCurrentBudget(
      userId,
      month,
      year,
    );
    if (!budget) {
      throw new HttpException('Budget not found', HttpStatus.NOT_FOUND);
    }
    return budget;
  }
}
