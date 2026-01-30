import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/request.dto';

@Controller('transaction')
export class TransactionController {
  constructor(
    @Inject(TransactionService) private transactionService: TransactionService,
  ) {}

  @Post()
  async createTransaction(
    @Req() req,
    @Body() createTransactionDto: CreateTransactionDto,
  ) {
    return this.transactionService.createTransaction(
      req.user.sub,
      createTransactionDto,
    );
  }

  @Get('user')
  async getAllTransactionsByUserId(@Req() req) {
    return this.transactionService.getAllTransactionsByUserId(req.user.sub);
  }
  @Get('account/:accountId')
  async getAllTransactionsByAccountId(
    @Req() req,
    @Param('accountId') accountId: string,
  ) {
    return this.transactionService.getAllTransactionsByAccountId(
      req.user.sub,
      accountId,
    );
  }
}
