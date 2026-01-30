import {
  Category,
  Currency,
  RecurrencePattern,
  TransactionStatus,
  TransactionType,
} from 'src/utils/enums';

export class CreateTransactionDto {
  description: string;
  amount: number;
  type: TransactionType;
  accountId: string;
  category: Category;
  date: Date;
  currency: Currency;
  status: TransactionStatus;
  recurrencePattern: RecurrencePattern;
  isRecurring: boolean;
}
