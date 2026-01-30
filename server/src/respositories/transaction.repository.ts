import { Repository } from 'typeorm';
import { Transaction } from 'src/entities/transaction.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from 'src/transaction/dto/request.dto';

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

  async findAllByUserId(userId: string) {
    return this.repository.find({ where: { user: { id: userId } } });
  }

  async findAllByAccountId(accountId: string) {
    return this.repository.find({
      where: { account: { id: accountId } },
    });
  }
}
