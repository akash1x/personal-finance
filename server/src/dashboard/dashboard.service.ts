import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { AccountRepository } from 'src/respositories/account.repository';
import { BudgetRepository } from 'src/respositories/budget.respository';
import { TransactionRepository } from 'src/respositories/transaction.repository';
import { UsersService } from 'src/users/users.service';
import { GetDashboardSummaryDto } from './dto/query.dto';

@Injectable()
export class DashboardService {
  constructor(
    @Inject(TransactionRepository)
    private transactionRepository: TransactionRepository,
    @Inject(BudgetRepository)
    private budgetRepository: BudgetRepository,
    @Inject(UsersService)
    private usersService: UsersService,
    @Inject(AccountRepository)
    private accountRepository: AccountRepository,
  ) {}
  async getDashboardSummary(userId: string, query: GetDashboardSummaryDto) {
    await this.usersService.userExists(userId);
    const { month, year } = query;
    const accounts = await this.accountRepository.getAccounts(userId);
    if (accounts.length === 0) {
      throw new HttpException('Accounts not found', HttpStatus.NOT_FOUND);
    }
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
    const expenseTotal =
      await this.transactionRepository.getExpenseTotalByMonthAndYear(
        userId,
        month,
        year,
      );

    const totalBalance = accounts.reduce(
      (acc, account) => acc + account.balance,
      0,
    );

    const getExpenseByCategory =
      await this.transactionRepository.getTotalExpenseByCategory(
        userId,
        month,
        year,
      );
    const expensePercentageByCategory = getExpenseByCategory.map((expense) => {
      const percentageOfBudget = (expense.total / budget.amount) * 100;
      return {
        category: expense.category,
        total: expense.total,
        percentageOfBudget,
      };
    });

    return {
      totalBalance,
      monthlyIncome: budget.amount + incomeTotal,
      monthlyExpense: expenseTotal,
      netSavings: budget.amount + incomeTotal - expenseTotal,
      expensePercentageByCategory,
    };
  }
}
