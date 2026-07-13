import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { DEFAULT_MEAL_PRICE } from "@/constants/meal";
import {
  buildMonthRows,
  countMeals,
  createEmptyDayMeals,
  createMonthSeed,
  dateKey,
  formatMonthYear,
  formatTodayDate,
  isFutureDay,
  parseDateKey,
  toggleMealSlot,
} from "@/lib/meal-utils";
import type { DayMeals, MealSlot, MonthDayRow } from "@/types/meal";

type MealContextValue = {
  today: Date;
  todayKey: string;
  mealPrice: number;
  records: Record<string, DayMeals>;
  monthDays: MonthDayRow[];
  totalMeals: number;
  totalExpense: number;
  formattedToday: string;
  monthLabel: string;
  getMeals: (key: string) => DayMeals;
  toggleMeal: (key: string, slot: MealSlot) => void;
};

const MealContext = createContext<MealContextValue | null>(null);

function createInitialRecords(today: Date): Record<string, DayMeals> {
  const seed = createMonthSeed(today);
  const todayK = dateKey(today);

  return {
    ...seed,
    [todayK]: seed[todayK] ?? createEmptyDayMeals(),
  };
}

export function MealProvider({ children }: { children: ReactNode }) {
  const today = useMemo(() => new Date(), []);
  const todayKey = dateKey(today);
  const [records, setRecords] = useState(() => createInitialRecords(today));
  const [mealPrice] = useState(DEFAULT_MEAL_PRICE);

  const monthDays = useMemo(
    () => buildMonthRows(today, records),
    [today, records],
  );

  const totalMeals = useMemo(
    () => monthDays.reduce((sum, row) => sum + row.mealCount, 0),
    [monthDays],
  );

  const totalExpense = totalMeals * mealPrice;

  const getMeals = useCallback(
    (key: string) => records[key] ?? createEmptyDayMeals(),
    [records],
  );

  const toggleMeal = useCallback(
    (key: string, slot: MealSlot) => {
      const rowDate = parseDateKey(key);
      if (isFutureDay(rowDate, today)) {
        return;
      }

      setRecords((current) => {
        const dayMeals = current[key] ?? createEmptyDayMeals();
        return {
          ...current,
          [key]: toggleMealSlot(dayMeals, slot),
        };
      });
    },
    [today],
  );

  const value = useMemo<MealContextValue>(
    () => ({
      today,
      todayKey,
      mealPrice,
      records,
      monthDays,
      totalMeals,
      totalExpense,
      formattedToday: formatTodayDate(today),
      monthLabel: formatMonthYear(today),
      getMeals,
      toggleMeal,
    }),
    [
      today,
      todayKey,
      mealPrice,
      records,
      monthDays,
      totalMeals,
      totalExpense,
      getMeals,
      toggleMeal,
    ],
  );

  return (
    <MealContext.Provider value={value}>{children}</MealContext.Provider>
  );
}

export function useMealStore() {
  const context = useContext(MealContext);

  if (!context) {
    throw new Error("useMealStore must be used within MealProvider");
  }

  return context;
}
