import {
  Body,
  Controller,
  Get,
  Inject,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { BudgetService } from './budget.service';
import { CreateBudgetDto } from './dto/request.dto';
import { Month } from 'src/utils/enums';

@Controller('budget')
export class BudgetController {
  constructor(
    @Inject(BudgetService) private readonly budgetService: BudgetService,
  ) {}

  @Post()
  create(@Req() req, @Body() createBudgetDto: CreateBudgetDto) {
    return this.budgetService.create(req.user.sub, createBudgetDto);
  }

  @Get()
  getCurrentBudgetStatus(
    @Req() req,
    @Query() query: { month: Month; year: number },
  ) {
    return this.budgetService.getCurrentBudgetStatus(
      req.user.sub,
      query.month,
      query.year,
    );
  }

  @Put()
  updateBudget(@Req() req, @Body() budget: CreateBudgetDto) {
    return this.budgetService.updateBudget(req.user.sub, budget);
  }
}
