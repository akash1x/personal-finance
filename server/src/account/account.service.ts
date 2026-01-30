import { Inject, Injectable } from '@nestjs/common';
import { AccountRepository } from 'src/respositories/account.repository';
import { CreateAccountDto } from './dto/request.dto';

@Injectable()
export class AccountService {
  constructor(
    @Inject(AccountRepository) private accountRepository: AccountRepository,
  ) {}

  async createAccount(createAccountDto: CreateAccountDto) {
    return this.accountRepository.createAccount(createAccountDto);
  }

  async getAccount() {
    return this.accountRepository.getAccount();
  }
}
