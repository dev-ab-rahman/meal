import { useMemo } from "react";

import { countMeals } from "@/lib/meal-utils";
import { useMealStore } from "@/context/meal-context";
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
    toggleMeal: toggleTodayMeal,
  };
}
