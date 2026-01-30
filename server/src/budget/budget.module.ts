import { Module } from '@nestjs/common';
import { BudgetController } from './budget.controller';
import { BudgetService } from './budget.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Budget } from '../entities/budget.entity';
import { BudgetRepository } from '../respositories/budget.respository';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Budget]), UsersModule],
  controllers: [BudgetController],
  providers: [BudgetService, BudgetRepository],
})
export class BudgetModule {}
