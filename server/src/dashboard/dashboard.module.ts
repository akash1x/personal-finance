import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Account } from 'src/entities/account.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Budget } from 'src/entities/budget.entity';
import { Transaction } from 'src/entities/transaction.entity';
import { UsersModule } from 'src/users/users.module';
import { TransactionRepository } from 'src/respositories/transaction.repository';
import { BudgetRepository } from 'src/respositories/budget.respository';
import { AccountRepository } from 'src/respositories/account.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Account, Budget, Transaction]),
    UsersModule,
  ],
  controllers: [DashboardController],
  providers: [
    DashboardService,
    TransactionRepository,
    BudgetRepository,
    AccountRepository,
  ],
})
export class DashboardModule {}
