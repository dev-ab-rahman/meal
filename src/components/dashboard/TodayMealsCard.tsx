import { Check, Coffee, Moon, UtensilsCrossed } from "lucide-react-native";
import { MotiView } from "moti";
import { Pressable, Text, View } from "react-native";

import { COLORS, MEAL_LABELS, MEAL_SLOTS } from "@/constants/meal";
import type { DayMeals, MealSlot } from "@/types/meal";

const MEAL_ICONS: Record<MealSlot, typeof Coffee> = {
  breakfast: Coffee,
  lunch: UtensilsCrossed,
  dinner: Moon,
};

type TodayMealsCardProps = {
  meals: DayMeals;
  onToggle: (slot: MealSlot) => void;
};

export default function TodayMealsCard({ meals, onToggle }: TodayMealsCardProps) {
  return (
    <View
      className="rounded-2xl border p-4"
      style={{
        backgroundColor: COLORS.surface,
        borderColor: COLORS.border,
      }}
    >
      <Text
        className="mb-4 text-lg font-semibold"
        style={{ color: COLORS.text }}
      >
        Today&apos;s Meals
      </Text>

      <View className="gap-3">
        {MEAL_SLOTS.map((slot) => {
          const eaten = meals[slot];
          const Icon = MEAL_ICONS[slot];

          return (
            <Pressable
              key={slot}
              onPress={() => onToggle(slot)}
              className="flex-row items-center justify-between rounded-xl border px-4 py-3"
              style={{
                backgroundColor: eaten ? "rgba(16,185,129,0.08)" : "#080A0B",
                borderColor: eaten ? "rgba(16,185,129,0.3)" : COLORS.border,
              }}
            >
              <View className="flex-row items-center gap-3">
                <View
                  className="h-10 w-10 items-center justify-center rounded-full"
                  style={{
                    backgroundColor: eaten
                      ? "rgba(16,185,129,0.18)"
                      : "rgba(255,255,255,0.04)",
                  }}
                >
                  <Icon
                    size={18}
                    color={eaten ? COLORS.accent : COLORS.muted}
                    strokeWidth={2.4}
                  />
                </View>

                <View>
                  <Text
                    className="font-medium"
                    style={{ color: COLORS.text }}
                  >
                    {MEAL_LABELS[slot]}
                  </Text>
                  <Text className="text-xs" style={{ color: COLORS.muted }}>
                    {eaten ? "Marked as eaten" : "Not eaten yet"}
                  </Text>
                </View>
              </View>

              <MotiView
                animate={{
                  scale: eaten ? 1 : 0.92,
                  backgroundColor: eaten ? COLORS.accent : "transparent",
                  borderColor: eaten ? COLORS.accent : COLORS.border,
                }}
                transition={{ type: "timing", duration: 180 }}
                className="h-7 w-7 items-center justify-center rounded-full border"
              >
                {eaten ? (
                  <Check size={14} color="#050607" strokeWidth={3} />
                ) : null}
              </MotiView>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
