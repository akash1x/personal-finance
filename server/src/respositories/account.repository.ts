import { Repository } from 'typeorm';
import { Account } from 'src/entities/account.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { CreateAccountDto } from 'src/account/dto/request.dto';

@Injectable()
export class AccountRepository {
  constructor(
    @InjectRepository(Account)
    private readonly repository: Repository<Account>,
  ) {}

  async createAccount(userId: string, createAccountDto: CreateAccountDto) {
    return this.repository.save({
      ...createAccountDto,
      user: { id: userId },
    });
  }

  async getAccount(userId: string) {
    return this.repository.find({ where: { user: { id: userId } } });
  }
}
