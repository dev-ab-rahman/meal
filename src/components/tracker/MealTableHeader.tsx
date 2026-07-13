import { Text, View } from "react-native";

import { COLORS } from "@/constants/meal";

const COLUMNS = ["Day", "B", "L", "D", "Total"] as const;

export default function MealTableHeader() {
  return (
    <View
      className="flex-row items-center rounded-t-2xl border px-3 py-3"
      style={{
        backgroundColor: COLORS.surface,
        borderColor: COLORS.border,
      }}
    >
      {COLUMNS.map((column, index) => (
        <Text
          key={column}
          className="text-xs font-semibold uppercase tracking-wide"
          style={{
            color: COLORS.muted,
            flex: index === 0 ? 1.4 : 1,
            textAlign: index === 0 ? "left" : "center",
          }}
        >
          {column}
        </Text>
      ))}
    </View>
  );
}
