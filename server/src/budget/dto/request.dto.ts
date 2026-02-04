import { Currency } from 'src/utils/enums';

export class CreateBudgetDto {
  amount: number;
  currency: Currency;
}
