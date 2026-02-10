import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TransactionRepository } from '../respositories/transaction.repository';

@Injectable()
export class MonitorService {
  constructor(
    @Inject(TransactionRepository)
    private transactionRepository: TransactionRepository,
  ) {}
  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async updateRecurringTransactions() {
    console.log('Updating recurring transactions');
    const transactions =
      await this.transactionRepository.findRecurringTransactions();

    const newTransactions = transactions.map((transaction) => ({
      ...transaction,
      id: undefined, // Create new transaction
      date: new Date(transaction.date.getTime() + 30 * 24 * 60 * 60 * 1000),
    }));

    if (newTransactions.length > 0) {
      await this.transactionRepository.saveRecurringTransactions(
        newTransactions,
      );
    }
  }
}
