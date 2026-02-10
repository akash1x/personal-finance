import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { TransactionRepository } from 'src/respositories/transaction.repository';
import { CreateTransactionDto } from './dto/request.dto';
import { UsersService } from 'src/v1/users/users.service';
import { BudgetRepository } from 'src/respositories/budget.respository';
import { Month } from 'src/utils/enums';
import { GetTransactionResponseDto } from './dto/response.dto';
import { Transaction } from 'src/entities/transaction.entity';
import { getNextExecutionDate } from 'src/utils/nextExecutionDate';
@Injectable()
export class TransactionService {
  constructor(
    @Inject(TransactionRepository)
    private transactionRepository: TransactionRepository,
    @Inject(UsersService) private usersService: UsersService,
    @Inject(BudgetRepository) private budgetRepository: BudgetRepository,
  ) {}

  async createTransaction(
    userId: string,
    createTransactionDto: CreateTransactionDto,
  ) {
    await this.usersService.userExists(userId);
    let nextExecutionDate: Date | null = null;
    if (createTransactionDto.isRecurring) {
      nextExecutionDate = getNextExecutionDate(
        createTransactionDto.recurrencePattern,
        createTransactionDto.date,
      );
    }
    return this.transactionRepository.createOne(
      userId,
      createTransactionDto,
      nextExecutionDate,
    );
  }

  async getAllTransactionsByUserId(
    userId: string,
    month: Month,
    year: number,
  ): Promise<GetTransactionResponseDto> {
    await this.usersService.userExists(userId);
    const transactions =
      await this.transactionRepository.findAllByUserId(userId);
    if (!transactions) {
      throw new HttpException('Transactions not found', HttpStatus.NOT_FOUND);
    }
    const budget = await this.budgetRepository.findBudget(userId, month, year);
    if (!budget) {
      throw new HttpException('Budget not found', HttpStatus.NOT_FOUND);
    }
    const totalIncome: number =
      await this.transactionRepository.getIncomeTotalByMonthAndYear(
        userId,
        month,
        year,
      );
    const totalExpense: number =
      await this.transactionRepository.getExpenseTotalByMonthAndYear(
        userId,
        month,
        year,
      );
    const netBalance = totalIncome - totalExpense;
    return {
      transactions,
      totalIncome,
      totalExpense,
      netBalance,
    };
  }

  async getAllTransactionsByAccountId(
    userId: string,
    accountId: string,
  ): Promise<Transaction[]> {
    await this.usersService.userExists(userId);
    const transactions =
      await this.transactionRepository.findAllByAccountId(accountId);
    if (!transactions) {
      throw new HttpException('Transactions not found', HttpStatus.NOT_FOUND);
    }
    return transactions;
  }
}
