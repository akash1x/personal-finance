import { Currency, Month } from 'src/utils/enums';
import { IsNotEmpty, IsNumber, IsEnum } from 'class-validator';

export class CreateBudgetDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsEnum(Currency)
  @IsNotEmpty()
  currency: Currency;

  @IsEnum(Month)
  @IsNotEmpty()
  month: Month;

  @IsNumber()
  @IsNotEmpty()
  year: number;
}
