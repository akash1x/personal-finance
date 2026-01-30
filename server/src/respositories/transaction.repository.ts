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

  async createOne(createTransactionDto: CreateTransactionDto) {
    const { accountId, ...transactionData } = createTransactionDto;
    return this.repository.save({
      ...transactionData,
      account: { id: accountId },
    });
  }

  async find() {
    return this.repository.find();
  }
}
