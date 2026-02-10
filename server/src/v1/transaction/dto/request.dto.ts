import {
  Category,
  Currency,
  RecurrencePattern,
  TransactionStatus,
  TransactionType,
} from 'src/utils/enums';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsEnum,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class CreateTransactionDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsEnum(TransactionType)
  @IsNotEmpty()
  type: TransactionType;

  @IsString()
  @IsNotEmpty()
  accountId: string;

  @IsEnum(Category)
  @IsNotEmpty()
  category: Category;

  @IsDateString()
  @IsNotEmpty()
  date: Date;

  @IsEnum(Currency)
  @IsNotEmpty()
  currency: Currency;

  @IsEnum(TransactionStatus)
  @IsNotEmpty()
  status: TransactionStatus;

  @IsEnum(RecurrencePattern)
  @IsNotEmpty()
  recurrencePattern: RecurrencePattern;

  @IsBoolean()
  @IsNotEmpty()
  isRecurring: boolean;
}
