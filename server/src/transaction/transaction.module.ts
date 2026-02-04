import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'src/entities/transaction.entity';
import { TransactionRepository } from 'src/respositories/transaction.repository';
import { UsersModule } from 'src/users/users.module';
import { Budget } from 'src/entities/budget.entity';
import { BudgetRepository } from 'src/respositories/budget.respository';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction, Budget]), UsersModule],
  providers: [TransactionService, TransactionRepository, BudgetRepository],
  controllers: [TransactionController],
})
export class TransactionModule {}
