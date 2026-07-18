import { Pressable, Text } from "react-native";

import { COLORS } from "@/constants/meal";

type GuestMealCellProps = {
  guestCount: number;
  onPress: () => void;
};

export default function GuestMealCell({ guestCount, onPress }: GuestMealCellProps) {
  return (
    <Pressable
      onPress={onPress}
      className="mx-0.5 h-9 flex-1 items-center justify-center rounded-lg border"
      style={{
        backgroundColor: guestCount > 0 ? "rgba(16,185,129,0.18)" : "#080A0B",
        borderColor: guestCount > 0 ? "rgba(16,185,129,0.4)" : COLORS.border,
      }}
    >
      <Text
        className="text-xs font-bold"
        style={{ color: guestCount > 0 ? COLORS.accent : COLORS.muted }}
      >
        {guestCount > 0 ? `G${guestCount}` : "G"}
      </Text>
    </Pressable>
  );
}
