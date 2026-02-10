import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TransactionRepository } from '../respositories/transaction.repository';
import { getNextExecutionDate } from 'src/utils/nextExecutionDate';

@Injectable()
export class MonitorService {
  constructor(
    @Inject(TransactionRepository)
    private transactionRepository: TransactionRepository,
  ) {}
  @Cron(CronExpression.EVERY_10_SECONDS)
  async updateRecurringTransactions() {
    console.log('Updating recurring transactions');
    const dueTransactions =
      await this.transactionRepository.findDueRecurringTransactions();

    const newTransactions = dueTransactions.map((transaction) => ({
      ...transaction,
      date: getNextExecutionDate(
        transaction.recurrencePattern,
        transaction.date,
      ),
    }));

    if (newTransactions.length > 0) {
      await this.transactionRepository.saveRecurringTransactions(
        newTransactions,
      );
    }
  }
}
