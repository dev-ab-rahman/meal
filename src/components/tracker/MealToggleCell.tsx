import { Pressable, Text } from "react-native";

import { COLORS } from "@/constants/meal";
import type { MealSlot } from "@/types/meal";

const SLOT_LABELS: Record<MealSlot, string> = {
  breakfast: "B",
  lunch: "L",
  dinner: "D",
};

type MealToggleCellProps = {
  slot: MealSlot;
  eaten: boolean;
  disabled?: boolean;
  onToggle: () => void;
};

export default function MealToggleCell({
  slot,
  eaten,
  disabled = false,
  onToggle,
}: MealToggleCellProps) {
  return (
    <Pressable
      onPress={onToggle}
      disabled={disabled}
      className="mx-0.5 h-9 flex-1 items-center justify-center rounded-lg border"
      style={{
        backgroundColor: eaten ? "rgba(16,185,129,0.18)" : "#080A0B",
        borderColor: eaten ? "rgba(16,185,129,0.4)" : COLORS.border,
        opacity: disabled ? 0.35 : 1,
      }}
    >
      <Text
        className="text-xs font-bold"
        style={{ color: eaten ? COLORS.accent : COLORS.muted }}
      >
        {SLOT_LABELS[slot]}
      </Text>
    </Pressable>
  );
}
