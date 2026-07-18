import { useMemo, useState } from "react";
import { Alert, Text, View } from "react-native";

import GuestMealCell from "@/components/tracker/GuestMealCell";
import GuestMealModal from "@/components/tracker/GuestMealModal";
import MealToggleCell from "@/components/tracker/MealToggleCell";
import { COLORS, MEAL_SLOTS } from "@/constants/meal";
import { useMealStore } from "@/context/meal-context";
import type { MealSlot, MonthDayRow } from "@/types/meal";

type MealTableRowProps = {
  row: MonthDayRow;
  onToggle: (key: string, slot: MealSlot) => void;
};

export default function MealTableRow({ row, onToggle }: MealTableRowProps) {
  const { setGuestCount, isCurrentMonth, today } = useMealStore();
  const [modalVisible, setModalVisible] = useState(false);
  const [editUnlocked, setEditUnlocked] = useState(false);
  const rowDate = useMemo(() => new Date(row.date), [row.date]);
  const isPastDay = rowDate < new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const canEdit = isCurrentMonth && row.isToday;
  const canRequestEdit = isCurrentMonth && !row.isFuture && !row.isToday && isPastDay;

  const requestEdit = (action: "toggle" | "guest", slot?: MealSlot) => {
    if (canEdit) {
      return;
    }

    if (!canRequestEdit) {
      return;
    }

    if (editUnlocked) {
      if (action === "guest") {
        setModalVisible(true);
      } else if (slot) {
        onToggle(row.key, slot);
      }
      return;
    }

    Alert.alert(
      "Edit past day?",
      "Do you want to modify this past day?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Yes",
          onPress: () => {
            setEditUnlocked(true);
            if (action === "guest") {
              setModalVisible(true);
            } else if (slot) {
              onToggle(row.key, slot);
            }
          },
        },
      ],
    );
  };

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
            disabled={row.isFuture || (!canEdit && !canRequestEdit)}
            onToggle={() => {
              if (canEdit) {
                onToggle(row.key, slot);
                return;
              }

              requestEdit("toggle", slot);
            }}
          />
        </View>
      ))}

      <View className="flex-1">
        <GuestMealCell
          guestCount={row.guestCount}
          disabled={row.isFuture || (!canEdit && !canRequestEdit)}
          onPress={() => {
            if (canEdit) {
              setModalVisible(true);
              return;
            }

            requestEdit("guest");
          }}
        />
      </View>

      <Text
        className="flex-1 text-center text-sm font-semibold"
        style={{ color: row.mealCount > 0 ? COLORS.accent : COLORS.muted }}
      >
        {row.mealCount}
      </Text>

      <GuestMealModal
        visible={modalVisible}
        guestCount={row.guestCount}
        onClose={() => setModalVisible(false)}
        onSave={(count) => {
          setGuestCount(row.key, count);
          setModalVisible(false);
        }}
      />
    </View>
  );
}
