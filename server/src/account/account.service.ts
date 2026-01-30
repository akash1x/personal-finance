import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { AccountRepository } from 'src/respositories/account.repository';
import { CreateAccountDto } from './dto/request.dto';
import { UsersService } from 'src/users/users.service';

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

  async getAccount(userId: string) {
    await this.usersService.userExists(userId);
    const account = await this.accountRepository.getAccount(userId);
    if (!account) {
      throw new HttpException('Account not found', HttpStatus.NOT_FOUND);
    }
    return account;
  }
}
