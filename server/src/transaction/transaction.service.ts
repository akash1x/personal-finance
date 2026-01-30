import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { TransactionRepository } from 'src/respositories/transaction.repository';
import { CreateTransactionDto } from './dto/request.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class TransactionService {
  constructor(
    @Inject(TransactionRepository)
    private transactionRepository: TransactionRepository,
    @Inject(UsersService) private usersService: UsersService,
  ) {}

  async createTransaction(
    userId: string,
    createTransactionDto: CreateTransactionDto,
  ) {
    await this.usersService.userExists(userId);
    return this.transactionRepository.createOne(userId, createTransactionDto);
  }

  async getAllTransactionsByUserId(userId: string) {
    await this.usersService.userExists(userId);
    const transactions =
      await this.transactionRepository.findAllByUserId(userId);
    if (!transactions) {
      throw new HttpException('Transactions not found', HttpStatus.NOT_FOUND);
    }
    return transactions;
  }

  async getAllTransactionsByAccountId(userId: string, accountId: string) {
    await this.usersService.userExists(userId);
    const transactions =
      await this.transactionRepository.findAllByAccountId(accountId);
    if (!transactions) {
      throw new HttpException('Transactions not found', HttpStatus.NOT_FOUND);
    }
    return transactions;
  }
}
