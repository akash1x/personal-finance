import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { BudgetRepository } from 'src/respositories/budget.respository';
import { CreateBudgetDto } from './dto/request.dto';
import { Month } from 'src/utils/enums';
import { UsersService } from 'src/users/users.service';
import { TransactionRepository } from 'src/respositories/transaction.repository';

@Injectable()
export class BudgetService {
  constructor(
    @Inject(BudgetRepository) private budgetRepository: BudgetRepository,
    @Inject(UsersService) private usersService: UsersService,
    @Inject(TransactionRepository)
    private transactionRepository: TransactionRepository,
  ) {}
  async create(userId: string, createBudgetDto: CreateBudgetDto) {
    await this.usersService.userExists(userId);
    return this.budgetRepository.saveBudget(userId, createBudgetDto);
  }

  async getCurrentBudgetStatus(userId: string, month: Month, year: number) {
    await this.usersService.userExists(userId);
    const budget = await this.budgetRepository.findBudget(userId);
    if (!budget) {
      throw new HttpException('Budget not found', HttpStatus.NOT_FOUND);
    }
    const incomeTotal: number =
      await this.transactionRepository.getIncomeTotalByMonthAndYear(
        userId,
        month,
        year,
      );
    const expenseTotal: number =
      await this.transactionRepository.getExpenseTotalByMonthAndYear(
        userId,
        month,
        year,
      );

    const remainingBudget = budget.amount + incomeTotal - expenseTotal;

    const totalExpenseByCategory =
      await this.transactionRepository.getTotalExpenseByCategory(
        userId,
        month,
        year,
      );
    const expenseByCategory = totalExpenseByCategory.map((expense) => {
      const percentageOfBudget = (expense.total / budget.amount) * 100;
      return {
        category: expense.category,
        total: expense.total,
        percentageOfBudget,
      };
    });
    return {
      budgetAmount: budget.amount,
      remainingBudget,
      expenseByCategory,
    };
  }

  async updateBudget(userId: string, budget: CreateBudgetDto) {
    await this.usersService.userExists(userId);
    return this.budgetRepository.upsertBudget(userId, budget);
  }
}
