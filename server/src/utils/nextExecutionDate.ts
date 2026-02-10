import { RecurrencePattern } from './enums';

export function getNextExecutionDate(
  recurrencePattern: RecurrencePattern,
  date: Date,
): Date {
  const nextExecutionDate = new Date(date);
  switch (recurrencePattern) {
    case RecurrencePattern.DAILY:
      nextExecutionDate.setDate(nextExecutionDate.getDate() + 1);
      break;
    case RecurrencePattern.WEEKLY:
      nextExecutionDate.setDate(nextExecutionDate.getDate() + 7);
      break;
    case RecurrencePattern.MONTHLY:
      nextExecutionDate.setMonth(nextExecutionDate.getMonth() + 1);
      break;
    case RecurrencePattern.YEARLY:
      nextExecutionDate.setFullYear(nextExecutionDate.getFullYear() + 1);
      break;
  }
  return nextExecutionDate;
}
