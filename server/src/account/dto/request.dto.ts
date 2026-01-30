import { AccountType } from '../../utils/enums';

export class CreateAccountDto {
  name: string;
  type: AccountType;
  balance: number;
}
