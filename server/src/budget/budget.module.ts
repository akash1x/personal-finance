import { Module } from '@nestjs/common';
import { BudgetController } from './budget.controller';
import { BudgetService } from './budget.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Budget } from '../entities/budget.entity';
import { BudgetRepository } from '../respositories/budget.respository';
import { UsersModule } from 'src/users/users.module';
import { Transaction } from 'src/entities/transaction.entity';
import { TransactionRepository } from 'src/respositories/transaction.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Budget, Transaction]), UsersModule],
  controllers: [BudgetController],
  providers: [BudgetService, BudgetRepository, TransactionRepository],
})
export class BudgetModule {}
