import { StatusBar } from "expo-status-bar";
import { CalendarDays, CircleDollarSign, Utensils, Wallet } from "lucide-react-native";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import StatCard from "@/components/dashboard/StatCard";
import TodayMealsCard from "@/components/dashboard/TodayMealsCard";
import { COLORS } from "@/constants/meal";
import { useDashboard } from "@/hooks/use-dashboard";
import { getMonthSummary } from "@/lib/meal-db";
import { getMonthKey } from "@/lib/meal-utils";
import { useState } from "react";

export default function DashboardScreen() {
  const {
    formattedDate,
    todayMeals,
    todayMealCount,
    totalMeals,
    totalExpense,
    mealPrice,
    toggleMeal,
    isMonthCleared,
    activeMonthKey,
    monthLabel,
    clearedMonths,
  } = useDashboard();
  const [currentMonth,setCurrentMonth] = useState<{
    totalMeals: number;
    totalExpense: number;
  } | null>(null);

  const monthCards = Array.from(new Set([activeMonthKey, ...clearedMonths])).map((monthKey) => {
    const [year, month] = monthKey.split("-").map(Number);
    const label = new Date(year, month - 1, 1).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    return {
      key: monthKey,
      label,
      status: clearedMonths.includes(monthKey) ? "Paid" : monthKey === activeMonthKey ? "Pending" : "Pending",
    };
  });
  const currentMonthKey = getMonthKey(new Date());

  async function loadSummary() {
    const summary = await getMonthSummary(currentMonthKey, mealPrice);
    setCurrentMonth(summary);
  }
  loadSummary();

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

        {isMonthCleared ? (
          <View className="mb-4 rounded-2xl border border-dashed px-4 py-3" style={{ borderColor: COLORS.border, backgroundColor: COLORS.surface }}>
            <Text className="text-sm" style={{ color: COLORS.textSecondary }}>
              This month has been marked as cleared, so its meal summary is hidden from the dashboard.
            </Text>
          </View>
        ) : (
          <View>
            <View className="flex-row gap-3">
              <StatCard
                label="Total Meals"
                value={String(currentMonth?.totalMeals ?? "Wait")}
                subtitle="Current month"
                icon={Utensils}
              />
              <StatCard
                label="Total Expense"
                value={`৳${currentMonth?.totalExpense ?? "Wait"}`}
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
          </View>
        )}

        {monthCards.length > 0 ? (
          <View className="mt-4 rounded-2xl border px-4 py-3" style={{ borderColor: COLORS.border, backgroundColor: COLORS.surface }}>
            <Text className="text-sm font-semibold" style={{ color: COLORS.text }}>
              Monthly cards
            </Text>
            <View className="mt-2 gap-2">
              {monthCards.map((month) => (
                <View key={month.key} className="flex-row items-center justify-between rounded-xl border px-3 py-2.5" style={{ borderColor: COLORS.border, backgroundColor: COLORS.background }}>
                  <View>
                    <Text className="text-sm font-semibold" style={{ color: COLORS.text }}>
                      {month.label}
                    </Text>
                    <Text className="text-xs" style={{ color: COLORS.textSecondary }}>
                      {month.key === activeMonthKey ? monthLabel : month.label}
                    </Text>
                  </View>
                  <View className="rounded-full px-2.5 py-1" style={{ backgroundColor: month.status === "Paid" ? "rgba(16,185,129,0.16)" : "rgba(245,158,11,0.16)" }}>
                    <Text className="text-xs font-semibold" style={{ color: month.status === "Paid" ? COLORS.accent : "#f59e0b" }}>
                      {month.status}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}
