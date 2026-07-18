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
  isMonthCleared as checkMonthCleared,
  deleteMealRecord,
  initMealDatabase,
  loadClearedMonths,
  loadMealRecords,
  markMonthAsCleared,
  saveMealRecord,
} from "@/lib/meal-db";
import {
  buildMonthRows,
  createEmptyDayMeals,
  dateKey,
  formatMonthYear,
  formatTodayDate,
  getMonthKey,
  isFutureDay,
  parseDateKey,
  toggleMealSlot,
} from "@/lib/meal-utils";
import type { DayMeals, MealSlot, MonthDayRow } from "@/types/meal";

type MealContextValue = {
  today: Date;
  todayKey: string;
  mealPrice: number;
  setMealPrice: (price: number) => void;
  records: Record<string, DayMeals & { guestCount?: number }>;
  monthDays: MonthDayRow[];
  totalMeals: number;
  totalExpense: number;
  formattedToday: string;
  monthLabel: string;
  activeMonthKey: string;
  isCurrentMonth: boolean;
  isMonthCleared: boolean;
  clearedMonths: string[];
  getMeals: (key: string) => DayMeals;
  toggleMeal: (key: string, slot: MealSlot) => void;
  setGuestCount: (key: string, guestCount: number) => void;
  goToPreviousMonth: () => void;
  goToNextMonth: () => void;
  clearDueForCurrentMonth: () => Promise<void>;
};

const MealContext = createContext<MealContextValue | null>(null);

function createInitialRecords(today: Date): Record<string, DayMeals & { guestCount?: number }> {
  const todayK = dateKey(today);

  return {
    [todayK]: createEmptyDayMeals(),
  };
}

export function MealProvider({ children }: { children: ReactNode }) {
  const [today] = useState(() => new Date());
  const [viewDate, setViewDate] = useState(() => new Date());
  const [activeMonthKey, setActiveMonthKey] = useState(() => getMonthKey(new Date()));
  const [isMonthCleared, setIsMonthCleared] = useState(false);
  const todayKey = dateKey(today);
  const [records, setRecords] = useState(() => createInitialRecords(today));
  const [mealPrice, setMealPriceState] = useState(DEFAULT_MEAL_PRICE);
  const [clearedMonths, setClearedMonths] = useState<string[]>([]);

  useEffect(() => {
    let active = true;

    const loadPersistedRecords = async () => {
      try {
        await initMealDatabase();
        const loadedRecords = await loadMealRecords();
        const cleared = await checkMonthCleared(activeMonthKey);
        const months = await loadClearedMonths();

        if (active) {
          setRecords(() => loadedRecords);
          setIsMonthCleared(cleared);
          setClearedMonths(months);
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
  }, [activeMonthKey, today]);

  const monthRecords = useMemo(() => {
    return Object.entries(records).reduce<Record<string, DayMeals & { guestCount?: number }>>((acc, [key, value]) => {
      if (key.startsWith(activeMonthKey)) {
        acc[key] = value;
      }
      return acc;
    }, {});
  }, [activeMonthKey, records]);

  const monthDays = useMemo(
    () => buildMonthRows(viewDate, monthRecords, today),
    [viewDate, monthRecords, today],
  );

  const totalMeals = useMemo(
    () => monthDays.reduce((sum, row) => sum + row.mealCount, 0),
    [monthDays],
  );

  const isCurrentMonth = useMemo(() => activeMonthKey === getMonthKey(today), [activeMonthKey, today]);

  const totalExpense = totalMeals * mealPrice;

  const persistDayRecord = useCallback((key: string, dayMeals: DayMeals, guestCount: number) => {
    const hasMeals = Object.values(dayMeals).some(Boolean);

    if (!hasMeals && guestCount <= 0) {
      void deleteMealRecord(key);
      return;
    }

    void saveMealRecord(key, dayMeals, guestCount);
  }, []);

  const goToPreviousMonth = useCallback(() => {
    setViewDate((current) => {
      const previous = new Date(current.getFullYear(), current.getMonth() - 1, 1);
      setActiveMonthKey(getMonthKey(previous));
      return previous;
    });
  }, []);

  const goToNextMonth = useCallback(() => {
    setViewDate((current) => {
      const next = new Date(current.getFullYear(), current.getMonth() + 1, 1);
      setActiveMonthKey(getMonthKey(next));
      return next;
    });
  }, []);

  const clearDueForCurrentMonth = useCallback(async () => {
    await markMonthAsCleared(activeMonthKey);
    setIsMonthCleared(true);
    setClearedMonths((current) => (current.includes(activeMonthKey) ? current : [...current, activeMonthKey]));
  }, [activeMonthKey]);

  const updateMealPrice = useCallback((price: number) => {
    setMealPriceState(Math.max(0, price));
  }, []);

  const getMeals = useCallback(
    (key: string) => records[key] ?? createEmptyDayMeals(),
    [records],
  );

  const setGuestCount = useCallback(
    (key: string, guestCount: number) => {
      const rowDate = parseDateKey(key);
      const isEditableDay = activeMonthKey === getMonthKey(today) && key === todayKey;

      if (!isEditableDay || isFutureDay(rowDate, today)) {
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
    [activeMonthKey, today, todayKey],
  );

  const toggleMeal = useCallback(
    (key: string, slot: MealSlot) => {
      const rowDate = parseDateKey(key);
      const isEditableDay = activeMonthKey === getMonthKey(today) && key === todayKey;

      if (!isEditableDay || isFutureDay(rowDate, today)) {
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
      setMealPrice: updateMealPrice,
      records,
      monthDays,
      totalMeals,
      totalExpense,
      formattedToday: formatTodayDate(today),
      monthLabel: formatMonthYear(viewDate),
      activeMonthKey,
      isCurrentMonth,
      isMonthCleared,
      clearedMonths,
      getMeals,
      toggleMeal,
      setGuestCount,
      goToPreviousMonth,
      goToNextMonth,
      clearDueForCurrentMonth,
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
      goToPreviousMonth,
      goToNextMonth,
      clearDueForCurrentMonth,
      updateMealPrice,
      activeMonthKey,
      isCurrentMonth,
      isMonthCleared,
      clearedMonths,
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
