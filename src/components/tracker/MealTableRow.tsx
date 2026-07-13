import { Text, View } from "react-native";

import MealToggleCell from "@/components/tracker/MealToggleCell";
import { COLORS, MEAL_SLOTS } from "@/constants/meal";
import type { MealSlot, MonthDayRow } from "@/types/meal";

type MealTableRowProps = {
  row: MonthDayRow;
  onToggle: (key: string, slot: MealSlot) => void;
};

export default function MealTableRow({ row, onToggle }: MealTableRowProps) {
  return (
    <View
      className="flex-row items-center border-b px-3 py-2.5"
      style={{
        backgroundColor: row.isToday ? "rgba(16,185,129,0.06)" : COLORS.surface,
        borderColor: COLORS.border,
      }}
    >
      <View className="flex-[1.4]">
        <Text
          className="text-sm font-semibold"
          style={{ color: row.isToday ? COLORS.accent : COLORS.text }}
        >
          {row.day}
        </Text>
        <Text className="text-xs" style={{ color: COLORS.muted }}>
          {row.weekday}
        </Text>
      </View>

      {MEAL_SLOTS.map((slot) => (
        <View key={slot} className="flex-1">
          <MealToggleCell
            slot={slot}
            eaten={row.meals[slot]}
            disabled={row.isFuture}
            onToggle={() => onToggle(row.key, slot)}
          />
        </View>
      ))}

      <Text
        className="flex-1 text-center text-sm font-semibold"
        style={{ color: row.mealCount > 0 ? COLORS.accent : COLORS.muted }}
      >
        {row.mealCount}
      </Text>
    </View>
  );
}
