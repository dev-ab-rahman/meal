import type { DayMeals, MealSlot, MonthDayRow } from "@/types/meal";

export function countMeals(meals: DayMeals): number {
  return Object.values(meals).filter(Boolean).length;
}

export function dateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function formatTodayDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function toggleMealSlot(meals: DayMeals, slot: MealSlot): DayMeals {
  return { ...meals, [slot]: !meals[slot] };
}

export function createEmptyDayMeals(): DayMeals {
  return { breakfast: false, lunch: false, dinner: false };
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function isFutureDay(date: Date, today: Date): boolean {
  const normalized = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const todayNormalized = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  return normalized.getTime() > todayNormalized.getTime();
}

export function formatMonthYear(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export function getWeekdayShort(date: Date): string {
  return date.toLocaleDateString("en-US", { weekday: "short" });
}

export function getDaysInMonth(year: number, month: number): Date[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return Array.from(
    { length: daysInMonth },
    (_, index) => new Date(year, month, index + 1),
  );
}

export function parseDateKey(key: string): Date {
  const [year, month, day] = key.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function buildMonthRows(
  viewDate: Date,
  records: Record<string, DayMeals & { guestCount?: number }>,
  today: Date = new Date(),
): MonthDayRow[] {
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  return getDaysInMonth(year, month).map((date) => {
    const key = dateKey(date);
    const record = records[key] ?? createEmptyDayMeals();
    const meals = record as DayMeals;
    const guestCount = typeof (record as DayMeals & { guestCount?: number }).guestCount === "number"
      ? (record as DayMeals & { guestCount?: number }).guestCount ?? 0
      : 0;

    return {
      key,
      date,
      day: date.getDate(),
      weekday: getWeekdayShort(date),
      meals,
      guestCount,
      mealCount: countMeals(meals) + guestCount,
      isToday: isSameDay(date, today),
      isFuture: isFutureDay(date, today),
    };
  });
}

/** Placeholder seed until SQLite is wired up. */
export function getMonthKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export function createMonthSeed(today: Date): Record<string, DayMeals> {
  const seed: Record<string, DayMeals> = {};

  for (let day = 1; day < today.getDate(); day++) {
    const date = new Date(today.getFullYear(), today.getMonth(), day);
    seed[dateKey(date)] = {
      breakfast: day % 4 !== 0,
      lunch: day % 7 !== 0,
      dinner: day % 3 !== 0,
    };
  }

  return seed;
}
