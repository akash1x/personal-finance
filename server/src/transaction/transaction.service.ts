import { Inject, Injectable } from '@nestjs/common';
import { TransactionRepository } from 'src/respositories/transaction.repository';
import { CreateTransactionDto } from './dto/request.dto';

@Injectable()
export class TransactionService {
  constructor(
    @Inject(TransactionRepository)
    private transactionRepository: TransactionRepository,
  ) {}

  async createTransaction(createTransactionDto: CreateTransactionDto) {
    return this.transactionRepository.createOne(createTransactionDto);
  }

  async getTransaction() {
    return this.transactionRepository.find();
  }
}
