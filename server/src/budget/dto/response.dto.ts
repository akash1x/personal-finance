import { ExpenseByCategory } from 'src/utils/types';

export class BudgetStatusResponseDto {
  budgetAmount: number;
  remainingBudget: number;
  expenseByCategory: ExpenseByCategory[];
}
