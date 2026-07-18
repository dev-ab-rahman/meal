import { StatusBar } from "expo-status-bar";
import { ChevronLeft, ChevronRight, Utensils, Wallet } from "lucide-react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import DueClearModal from "@/components/tracker/DueClearModal";
import MealTableHeader from "@/components/tracker/MealTableHeader";
import MealTableRow from "@/components/tracker/MealTableRow";
import { COLORS } from "@/constants/meal";
import { useMealStore } from "@/context/meal-context";
import type { MonthDayRow } from "@/types/meal";

export default function MonthlyTrackerScreen() {
  const {
    monthLabel,
    monthDays,
    totalMeals,
    totalExpense,
    toggleMeal,
    activeMonthKey,
    isCurrentMonth,
    isMonthCleared,
    goToPreviousMonth,
    goToNextMonth,
    clearDueForCurrentMonth,
  } = useMealStore();

  const listRef = useRef<FlatList<MonthDayRow>>(null);
  const [dueModalVisible, setDueModalVisible] = useState(false);
  const todayIndex = monthDays.findIndex((row) => row.isToday);
  const monthTitle = useMemo(() => monthLabel, [monthLabel]);

  useEffect(() => {
    if (todayIndex < 0) {
      return;
    }

    const timer = setTimeout(() => {
      listRef.current?.scrollToIndex({
        index: todayIndex,
        animated: true,
        viewPosition: 0.5,
      });
    }, 250);

    return () => clearTimeout(timer);
  }, [todayIndex]);

  return (
    <SafeAreaView
      className="flex-1"
      style={{ backgroundColor: COLORS.background }}
      edges={["top"]}
    >
      <StatusBar style="light" />

      <View className="px-5 pb-3 pt-2">
        <Text className="text-sm font-medium" style={{ color: COLORS.accent }}>
          Meal Tracker
        </Text>
        <Text
          className="mt-1 text-3xl font-bold"
          style={{ color: COLORS.text }}
        >
          Monthly Tracker
        </Text>
        <View className="mt-2 flex-row items-center justify-between">
          <Text className="text-base" style={{ color: COLORS.textSecondary }}>
            {monthTitle}
          </Text>
          <View className="flex-row items-center gap-2">
            <Pressable
              onPress={goToPreviousMonth}
              className="h-9 w-9 items-center justify-center rounded-full border"
              style={{ borderColor: COLORS.border, backgroundColor: COLORS.surface }}
            >
              <ChevronLeft size={18} color={COLORS.text} />
            </Pressable>
            <Pressable
              onPress={goToNextMonth}
              className="h-9 w-9 items-center justify-center rounded-full border"
              style={{ borderColor: COLORS.border, backgroundColor: COLORS.surface }}
            >
              <ChevronRight size={18} color={COLORS.text} />
            </Pressable>
          </View>
        </View>

        {!isCurrentMonth && !isMonthCleared ? (
          <Pressable
            onPress={() => setDueModalVisible(true)}
            className="mt-3 rounded-2xl border px-3 py-2"
            style={{ borderColor: COLORS.border, backgroundColor: COLORS.surface }}
          >
            <Text className="text-sm font-medium" style={{ color: COLORS.accent }}>
              Due Clear
            </Text>
          </Pressable>
        ) : null}

        <View className="mt-4 flex-row gap-3">
          <View
            className="flex-1 flex-row items-center gap-3 rounded-2xl border p-3"
            style={{
              backgroundColor: COLORS.surface,
              borderColor: COLORS.border,
            }}
          >
            <Utensils size={18} color={COLORS.accent} strokeWidth={2.4} />
            <View>
              <Text className="text-xs" style={{ color: COLORS.muted }}>
                Total Meals
              </Text>
              <Text
                className="text-lg font-bold"
                style={{ color: COLORS.text }}
              >
                {totalMeals}
              </Text>
            </View>
          </View>

          <View
            className="flex-1 flex-row items-center gap-3 rounded-2xl border p-3"
            style={{
              backgroundColor: COLORS.surface,
              borderColor: COLORS.border,
            }}
          >
            <Wallet size={18} color={COLORS.accent} strokeWidth={2.4} />
            <View>
              <Text className="text-xs" style={{ color: COLORS.muted }}>
                Total Expense
              </Text>
              <Text
                className="text-lg font-bold"
                style={{ color: COLORS.text }}
              >
                ৳{totalExpense}
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View
        className="mx-5 mb-2 min-h-0 flex-1 overflow-hidden rounded-2xl border"
        style={{ borderColor: COLORS.border }}
      >
        <MealTableHeader />
        <FlatList
          ref={listRef}
          data={monthDays}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <MealTableRow row={item} onToggle={toggleMeal} />
          )}
          showsVerticalScrollIndicator={false}
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingBottom: 140 }}
          onScrollToIndexFailed={(info) => {
            listRef.current?.scrollToOffset({
              offset: info.averageItemLength * info.index,
              animated: true,
            });
          }}
        />
      </View>

      <DueClearModal
        visible={dueModalVisible}
        monthLabel={monthTitle}
        onClose={() => setDueModalVisible(false)}
        onConfirm={async () => {
          await clearDueForCurrentMonth();
          setDueModalVisible(false);
        }}
      />
    </SafeAreaView>
  );
}
