import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/request.dto';
import { Month } from 'src/utils/enums';

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
  async getAllTransactionsByUserId(
    @Req() req,
    @Query() query: { month: Month; year: number },
  ) {
    return this.transactionService.getAllTransactionsByUserId(
      req.user.sub,
      query.month,
      query.year,
    );
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
