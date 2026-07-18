export type MealSlot = "breakfast" | "lunch" | "dinner";

export type DayMeals = Record<MealSlot, boolean>;

export type DayGuestMeals = {
  guestCount: number;
};

export type MonthSummary = {
  totalMeals: number;
  totalExpense: number;
};

export type ClearedMonth = {
  monthKey: string;
};

export type MonthDayRow = {
  key: string;
  date: Date;
  day: number;
  weekday: string;
  meals: DayMeals;
  guestCount: number;
  mealCount: number;
  isToday: boolean;
  isFuture: boolean;
};
