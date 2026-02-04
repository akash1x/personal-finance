import { Between, Repository } from 'typeorm';
import { Transaction } from 'src/entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from 'src/transaction/dto/request.dto';
import { Month } from 'src/utils/enums';

// Month name to number mapping (0-indexed for JS Date constructor)
const monthToIndex: Record<Month, number> = {
  [Month.JANUARY]: 0,
  [Month.FEBRUARY]: 1,
  [Month.MARCH]: 2,
  [Month.APRIL]: 3,
  [Month.MAY]: 4,
  [Month.JUNE]: 5,
  [Month.JULY]: 6,
  [Month.AUGUST]: 7,
  [Month.SEPTEMBER]: 8,
  [Month.OCTOBER]: 9,
  [Month.NOVEMBER]: 10,
  [Month.DECEMBER]: 11,
};

@Injectable()
export class TransactionRepository {
  constructor(
    @InjectRepository(Transaction)
    private repository: Repository<Transaction>,
  ) {}

  async createOne(userId: string, createTransactionDto: CreateTransactionDto) {
    const { accountId, ...transactionData } = createTransactionDto;
    return this.repository.save({
      ...transactionData,
      account: { id: accountId },
      user: { id: userId },
    });
  }

  async findTransactionsByMonthAndYear(
    userId: string,
    month: Month,
    year: number,
  ) {
    const monthIndex = monthToIndex[month];
    // First day of the month at 00:00:00
    const startDate = new Date(year, monthIndex, 1);
    // Last day of the month at 23:59:59.999
    const endDate = new Date(year, monthIndex + 1, 0, 23, 59, 59, 999);

    return this.repository.find({
      where: {
        user: { id: userId },
        date: Between(startDate, endDate),
      },
    });
  }

  async getIncomeTotalByMonthAndYear(
    userId: string,
    month: Month,
    year: number,
  ): Promise<number> {
    const monthIndex = monthToIndex[month];
    const startDate = new Date(year, monthIndex, 1);
    const endDate = new Date(year, monthIndex + 1, 0, 23, 59, 59, 999);

    const result = await this.repository
      .createQueryBuilder('transaction')
      .select('COALESCE(SUM(transaction.amount), 0)', 'total')
      .where('transaction.userId = :userId', { userId })
      .andWhere('transaction.type = :type', { type: 'income' })
      .andWhere('transaction.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getRawOne<{ total: string }>();

    return parseFloat(result?.total ?? '0');
  }

  async getExpenseTotalByMonthAndYear(
    userId: string,
    month: Month,
    year: number,
  ): Promise<number> {
    const monthIndex = monthToIndex[month];
    const startDate = new Date(year, monthIndex, 1);
    const endDate = new Date(year, monthIndex + 1, 0, 23, 59, 59, 999);

    const result = await this.repository
      .createQueryBuilder('transaction')
      .select('COALESCE(SUM(transaction.amount), 0)', 'total')
      .where('transaction.userId = :userId', { userId })
      .andWhere('transaction.type = :type', { type: 'expense' })
      .andWhere('transaction.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .getRawOne<{ total: string }>();

    return parseFloat(result?.total ?? '0');
  }

  async getTotalExpenseByCategory(userId: string, month: Month, year: number) {
    const monthIndex = monthToIndex[month];
    const startDate = new Date(year, monthIndex, 1);
    const endDate = new Date(year, monthIndex + 1, 0, 23, 59, 59, 999);

    const result = await this.repository
      .createQueryBuilder('transaction')
      .select('transaction.category', 'category')
      .addSelect('SUM(transaction.amount)', 'total')
      .where('transaction.userId = :userId', { userId })
      .andWhere('transaction.type = :type', { type: 'expense' })
      .andWhere('transaction.date BETWEEN :startDate AND :endDate', {
        startDate,
        endDate,
      })
      .groupBy('transaction.category')
      .getRawMany<{ category: string; total: string }>();

    return result.map((r) => ({
      category: r.category,
      total: parseFloat(r.total),
    }));
  }

  async findAllByUserId(userId: string) {
    return this.repository.find({
      where: { user: { id: userId } },
      order: { date: 'DESC' },
    });
  }

  async findAllByAccountId(accountId: string) {
    return this.repository.find({
      where: { account: { id: accountId } },
    });
  }
}
