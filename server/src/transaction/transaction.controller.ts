import { Body, Controller, Get, Inject, Post } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/request.dto';

@Controller('transaction')
export class TransactionController {
  constructor(
    @Inject(TransactionService) private transactionService: TransactionService,
  ) {}

  @Post()
  async createTransaction(@Body() createTransactionDto: CreateTransactionDto) {
    return this.transactionService.createTransaction(createTransactionDto);
  }

  @Get()
  async getTransaction() {
    return this.transactionService.getTransaction();
  }
}
