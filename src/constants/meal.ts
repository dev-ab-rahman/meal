import type { MealSlot } from "@/types/meal";

export const DEFAULT_MEAL_PRICE = 55;

export const MEAL_SLOTS: MealSlot[] = ["breakfast", "lunch", "dinner"];

export const MEAL_LABELS: Record<MealSlot, string> = {
  breakfast: "Breakfast",
  lunch: "Lunch",
  dinner: "Dinner",
};

export const COLORS = {
  background: "#050607",
  surface: "#0B0F10",
  border: "#1C1F22",
  accent: "#10B981",
  muted: "#7A7A7A",
  text: "#F5F5F5",
  textSecondary: "#A3A3A3",
} as const;
