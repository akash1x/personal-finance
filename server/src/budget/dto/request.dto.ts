import { Currency, Month } from 'src/utils/enums';

export class CreateBudgetDto {
  name: string;
  amount: number;
  currency: Currency;
  month: Month;
  year: number;
}
