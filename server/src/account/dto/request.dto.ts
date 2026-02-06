import { AccountType } from '../../utils/enums';
import { IsNotEmpty, IsString, IsNumber, IsEnum } from 'class-validator';

export class CreateAccountDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(AccountType)
  @IsNotEmpty()
  type: AccountType;

  @IsNumber()
  @IsNotEmpty()
  balance: number;
}
