import { Modal, Pressable, Text, TextInput, View } from "react-native";

import { COLORS } from "@/constants/meal";

type GuestMealModalProps = {
  visible: boolean;
  guestCount: number;
  onClose: () => void;
  onSave: (count: number) => void;
};

const QUICK_OPTIONS = [1, 2, 3, 4, 5];

export default function GuestMealModal({
  visible,
  guestCount,
  onClose,
  onSave,
}: GuestMealModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/70 px-4">
        <View
          className="w-full max-w-md rounded-3xl border p-5"
          style={{ backgroundColor: COLORS.surface, borderColor: COLORS.border }}
        >
          <Text className="text-xl font-semibold" style={{ color: COLORS.text }}>
            Guest Meals
          </Text>
          <Text className="mt-2 text-sm" style={{ color: COLORS.textSecondary }}>
            Set how many guest meals you want to add for this day.
          </Text>

          <View className="mt-4 flex-row flex-wrap gap-2">
            {QUICK_OPTIONS.map((option) => {
              const selected = guestCount === option;

              return (
                <Pressable
                  key={option}
                  onPress={() => onSave(option)}
                  className="rounded-xl border px-3 py-2"
                  style={{
                    backgroundColor: selected ? "rgba(16,185,129,0.16)" : "#080A0B",
                    borderColor: selected ? "rgba(16,185,129,0.4)" : COLORS.border,
                  }}
                >
                  <Text style={{ color: selected ? COLORS.accent : COLORS.text }}>
                    {option}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <TextInput
            keyboardType="numeric"
            value={String(guestCount)}
            onChangeText={(text) => {
              const parsed = Number(text.replace(/\D/g, ""));
              onSave(Number.isFinite(parsed) ? parsed : 0);
            }}
            placeholder="Enter guest count"
            placeholderTextColor={COLORS.muted}
            className="mt-4 rounded-xl border px-3 py-3"
            style={{
              color: COLORS.text,
              borderColor: COLORS.border,
              backgroundColor: "#080A0B",
            }}
          />

          <View className="mt-5 flex-row justify-end gap-2">
            <Pressable
              onPress={onClose}
              className="rounded-xl px-4 py-2"
              style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
            >
              <Text style={{ color: COLORS.text }}>Close</Text>
            </Pressable>
            <Pressable
              onPress={() => onSave(0)}
              className="rounded-xl px-4 py-2"
              style={{ backgroundColor: "rgba(239,68,68,0.14)" }}
            >
              <Text style={{ color: "#F87171" }}>Clear</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
