import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { AccountRepository } from 'src/respositories/account.repository';
import { CreateAccountDto } from './dto/request.dto';
import { UsersService } from 'src/users/users.service';
import { AccountsResponseDto } from './dto/response.dto';

@Injectable()
export class AccountService {
  constructor(
    @Inject(AccountRepository) private accountRepository: AccountRepository,
    @Inject(UsersService) private usersService: UsersService,
  ) {}

  async createAccount(userId: string, createAccountDto: CreateAccountDto) {
    await this.usersService.userExists(userId);
    return this.accountRepository.createAccount(userId, createAccountDto);
  }

  async getAccounts(userId: string): Promise<AccountsResponseDto> {
    await this.usersService.userExists(userId);
    const accounts = await this.accountRepository.getAccounts(userId);
    if (accounts.length === 0) {
      throw new HttpException('Accounts not found', HttpStatus.NOT_FOUND);
    }
    const totalBalance = accounts.reduce(
      (acc, account) => acc + account.balance,
      0,
    );
    return { accounts, totalBalance };
  }
}
