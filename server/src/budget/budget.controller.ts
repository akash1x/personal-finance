import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { BudgetService } from './budget.service';
import { CreateBudgetDto } from './dto/request.dto';
import { Month } from 'src/utils/enums';

@Controller('budget')
export class BudgetController {
  constructor(
    @Inject(BudgetService) private readonly budgetService: BudgetService,
  ) {}

  @Post()
  create(@Body() createBudgetDto: CreateBudgetDto) {
    return this.budgetService.create(createBudgetDto);
  }

  @Get()
  getCurrentBudget(@Query() query: { month: Month; year: number }) {
    return this.budgetService.getCurrentBudget(query.month, query.year);
  }
}
