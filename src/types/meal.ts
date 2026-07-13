export type MealSlot = "breakfast" | "lunch" | "dinner";

export type DayMeals = Record<MealSlot, boolean>;

export type MonthSummary = {
  totalMeals: number;
  totalExpense: number;
};

export type MonthDayRow = {
  key: string;
  date: Date;
  day: number;
  weekday: string;
  meals: DayMeals;
  mealCount: number;
  isToday: boolean;
  isFuture: boolean;
};
