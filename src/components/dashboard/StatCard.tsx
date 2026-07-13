import type { LucideIcon } from "lucide-react-native";
import { Text, View } from "react-native";

import { COLORS } from "@/constants/meal";

type StatCardProps = {
  label: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
};

export default function StatCard({
  label,
  value,
  subtitle,
  icon: Icon,
}: StatCardProps) {
  return (
    <View
      className="flex-1 rounded-2xl border p-4"
      style={{
        backgroundColor: COLORS.surface,
        borderColor: COLORS.border,
      }}
    >
      <View
        className="mb-3 h-10 w-10 items-center justify-center rounded-full"
        style={{ backgroundColor: "rgba(16,185,129,0.14)" }}
      >
        <Icon size={20} color={COLORS.accent} strokeWidth={2.4} />
      </View>

      <Text className="text-sm" style={{ color: COLORS.muted }}>
        {label}
      </Text>

      <Text
        className="mt-1 text-2xl font-bold"
        style={{ color: COLORS.text }}
      >
        {value}
      </Text>

      {subtitle ? (
        <Text className="mt-1 text-xs" style={{ color: COLORS.textSecondary }}>
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}
