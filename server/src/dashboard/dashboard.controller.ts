import { Controller, Get, Inject, Query, Req } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { GetDashboardSummaryDto } from './dto/query.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(
    @Inject(DashboardService)
    private readonly dashboardService: DashboardService,
  ) {}

  @Get()
  async getDashboardSummary(
    @Req() req,
    @Query() query: GetDashboardSummaryDto,
  ) {
    return this.dashboardService.getDashboardSummary(req.user.sub, query);
  }
}
