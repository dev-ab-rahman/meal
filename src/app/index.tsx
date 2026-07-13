import { StatusBar } from "expo-status-bar";
import { CalendarDays, CircleDollarSign, Utensils, Wallet } from "lucide-react-native";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import StatCard from "@/components/dashboard/StatCard";
import TodayMealsCard from "@/components/dashboard/TodayMealsCard";
import { COLORS } from "@/constants/meal";
import { useDashboard } from "@/hooks/use-dashboard";

export default function DashboardScreen() {
  const {
    formattedDate,
    todayMeals,
    todayMealCount,
    totalMeals,
    totalExpense,
    mealPrice,
    toggleMeal,
  } = useDashboard();

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: COLORS.background }}
      edges={["top"]}
    >
      <StatusBar style="light" />

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-36 pt-2"
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-6">
          <Text className="text-sm font-medium" style={{ color: COLORS.accent }}>
            Meal Tracker
          </Text>
          <Text
            className="mt-1 text-3xl font-bold"
            style={{ color: COLORS.text }}
          >
            Dashboard
          </Text>
        </View>

        <View
          className="mb-5 flex-row items-center gap-3 rounded-2xl border p-4"
          style={{
            backgroundColor: COLORS.surface,
            borderColor: COLORS.border,
          }}
        >
          <View
            className="h-12 w-12 items-center justify-center rounded-full"
            style={{ backgroundColor: "rgba(16,185,129,0.14)" }}
          >
            <CalendarDays size={22} color={COLORS.accent} strokeWidth={2.4} />
          </View>

          <View className="flex-1">
            <Text className="text-xs uppercase tracking-wide" style={{ color: COLORS.muted }}>
              Today
            </Text>
            <Text
              className="mt-0.5 text-base font-semibold"
              style={{ color: COLORS.text }}
            >
              {formattedDate}
            </Text>
            <Text className="mt-1 text-sm" style={{ color: COLORS.textSecondary }}>
              {todayMealCount} of 3 meals marked today
            </Text>
          </View>
        </View>

        <TodayMealsCard meals={todayMeals} onToggle={toggleMeal} />

        <Text
          className="mb-3 mt-6 text-lg font-semibold"
          style={{ color: COLORS.text }}
        >
          This Month
        </Text>

        <View className="flex-row gap-3">
          <StatCard
            label="Total Meals"
            value={String(totalMeals)}
            subtitle="Current month"
            icon={Utensils}
          />
          <StatCard
            label="Total Expense"
            value={`৳${totalExpense}`}
            subtitle="Auto calculated"
            icon={Wallet}
          />
        </View>

        <View className="mt-3">
          <StatCard
            label="Meal Price"
            value={`৳${mealPrice}`}
            subtitle="Per meal · change in Settings"
            icon={CircleDollarSign}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
