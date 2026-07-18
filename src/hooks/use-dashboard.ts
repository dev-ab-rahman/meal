import { useMemo } from "react";

import { useMealStore } from "@/context/meal-context";
import { countMeals } from "@/lib/meal-utils";
import type { MealSlot } from "@/types/meal";

export function useDashboard() {
  const {
    todayKey,
    formattedToday,
    getMeals,
    toggleMeal,
    totalMeals,
    totalExpense,
    mealPrice,
    isMonthCleared,
  } = useMealStore();

  const todayMeals = getMeals(todayKey);
  const todayMealCount = useMemo(() => countMeals(todayMeals), [todayMeals]);

  const toggleTodayMeal = (slot: MealSlot) => {
    toggleMeal(todayKey, slot);
  };

  return {
    formattedDate: formattedToday,
    todayMeals,
    todayMealCount,
    totalMeals,
    totalExpense,
    mealPrice,
    isMonthCleared,
    toggleMeal: toggleTodayMeal,
  };
}
