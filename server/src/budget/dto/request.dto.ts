import { Currency } from 'src/utils/enums';
import { IsNotEmpty, IsNumber, IsEnum } from 'class-validator';

export class CreateBudgetDto {
  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsEnum(Currency)
  @IsNotEmpty()
  currency: Currency;
}
