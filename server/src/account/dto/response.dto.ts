import { Account } from '../../entities/account.entity';

export class AccountsResponseDto {
  totalBalance: number;
  accounts: Account[];
}
