import { Body, Controller, Get, Inject, Post, Req } from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/request.dto';

@Controller('account')
export class AccountController {
  constructor(
    @Inject(AccountService) private readonly accountService: AccountService,
  ) {}

  @Post()
  async createAccount(@Req() req, @Body() createAccountDto: CreateAccountDto) {
    return this.accountService.createAccount(req.user.sub, createAccountDto);
  }

  @Get()
  async getAccount(@Req() req) {
    return this.accountService.getAccount(req.user.sub);
  }
}
