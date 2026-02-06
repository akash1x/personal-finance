import { ExpenseByCategory } from 'src/utils/types';

export class GetDashboardSummaryResponseDto {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpense: number;
  netSavings: number;
  expensePercentageByCategory: ExpenseByCategory[];
}
