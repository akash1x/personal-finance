import { Month } from 'src/utils/enums';
import { IsEnum, IsNumber } from 'class-validator';

export class GetDashboardSummaryQueryDto {
  @IsEnum(Month)
  month: Month;

  @IsNumber()
  year: number;
}
