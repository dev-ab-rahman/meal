import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { DEFAULT_MEAL_PRICE } from "@/constants/meal";
import {
  deleteMealRecord,
  initMealDatabase,
  loadMealRecords,
  saveMealRecord,
} from "@/lib/meal-db";
import {
  buildMonthRows,
  createEmptyDayMeals,
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
  records: Record<string, DayMeals & { guestCount?: number }>;
  monthDays: MonthDayRow[];
  totalMeals: number;
  totalExpense: number;
  formattedToday: string;
  monthLabel: string;
  getMeals: (key: string) => DayMeals;
  toggleMeal: (key: string, slot: MealSlot) => void;
  setGuestCount: (key: string, guestCount: number) => void;
};

const MealContext = createContext<MealContextValue | null>(null);

function createInitialRecords(today: Date): Record<string, DayMeals & { guestCount?: number }> {
  const todayK = dateKey(today);

  return {
    [todayK]: createEmptyDayMeals(),
  };
}

export function MealProvider({ children }: { children: ReactNode }) {
  const today = useMemo(() => new Date(), []);
  const todayKey = dateKey(today);
  const [records, setRecords] = useState(() => createInitialRecords(today));
  const [mealPrice] = useState(DEFAULT_MEAL_PRICE);

  useEffect(() => {
    let active = true;

    const loadPersistedRecords = async () => {
      try {
        await initMealDatabase();
        const loadedRecords = await loadMealRecords();

        if (active) {
          setRecords(() => loadedRecords);
        }
      } catch (error) {
        console.warn("Failed to load persisted meal records", error);
        if (active) {
          setRecords(() => createInitialRecords(today));
        }
      }
    };

    void loadPersistedRecords();

    return () => {
      active = false;
    };
  }, [today]);

  const monthDays = useMemo(
    () => buildMonthRows(today, records),
    [today, records],
  );

  const totalMeals = useMemo(
    () => monthDays.reduce((sum, row) => sum + row.mealCount, 0),
    [monthDays],
  );

  const totalExpense = totalMeals * mealPrice;

  const persistDayRecord = useCallback((key: string, dayMeals: DayMeals, guestCount: number) => {
    const hasMeals = Object.values(dayMeals).some(Boolean);

    if (!hasMeals && guestCount <= 0) {
      void deleteMealRecord(key);
      return;
    }

    void saveMealRecord(key, dayMeals, guestCount);
  }, []);

  const getMeals = useCallback(
    (key: string) => records[key] ?? createEmptyDayMeals(),
    [records],
  );

  const setGuestCount = useCallback(
    (key: string, guestCount: number) => {
      const rowDate = parseDateKey(key);
      if (isFutureDay(rowDate, today)) {
        return;
      }

      setRecords((current) => {
        const dayMeals = current[key] ?? createEmptyDayMeals();
        const nextEntry = {
          ...dayMeals,
          guestCount,
        } as DayMeals & { guestCount: number };

        persistDayRecord(key, dayMeals, guestCount);

        return {
          ...current,
          [key]: nextEntry,
        };
      });
    },
    [today],
  );

  const toggleMeal = useCallback(
    (key: string, slot: MealSlot) => {
      const rowDate = parseDateKey(key);
      if (isFutureDay(rowDate, today)) {
        return;
      }

      setRecords((current) => {
        const dayMeals = current[key] ?? createEmptyDayMeals();
        const existingGuestCount = current[key]?.guestCount ?? 0;
        const nextMeals = toggleMealSlot(dayMeals, slot);
        const nextEntry = {
          ...nextMeals,
          guestCount: existingGuestCount,
        } as DayMeals & { guestCount: number };

        persistDayRecord(key, nextMeals, existingGuestCount);

        return {
          ...current,
          [key]: nextEntry,
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
      setGuestCount,
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
      setGuestCount,
      persistDayRecord,
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
