import { Controller, Get, Inject, Query, Req } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { GetDashboardSummaryQueryDto } from './dto/request.dto';

@Controller('dashboard')
export class DashboardController {
  constructor(
    @Inject(DashboardService)
    private readonly dashboardService: DashboardService,
  ) {}

  @Get()
  async getDashboardSummary(
    @Req() req,
    @Query() query: GetDashboardSummaryQueryDto,
  ) {
    return this.dashboardService.getDashboardSummary(req.user.sub, query);
  }
}
