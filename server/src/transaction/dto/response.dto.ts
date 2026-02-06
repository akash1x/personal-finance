import { Transaction } from 'src/entities/transaction.entity';

export class GetTransactionResponseDto {
  transactions: Transaction[];
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
}
