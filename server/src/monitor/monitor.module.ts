import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { MonitorService } from './monitor.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Transaction } from 'src/entities/transaction.entity';
import { TransactionRepository } from 'src/respositories/transaction.repository';

@Module({
  imports: [ScheduleModule.forRoot(), TypeOrmModule.forFeature([Transaction])],
  providers: [MonitorService, TransactionRepository],
})
export class MonitorModule {}
