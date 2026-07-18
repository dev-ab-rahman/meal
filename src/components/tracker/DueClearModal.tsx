import { Modal, Pressable, Text, View } from "react-native";

import { COLORS } from "@/constants/meal";

type DueClearModalProps = {
  visible: boolean;
  monthLabel: string;
  onClose: () => void;
  onConfirm: () => void;
};

export default function DueClearModal({ visible, monthLabel, onClose, onConfirm }: DueClearModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View className="flex-1 items-center justify-center bg-black/70 px-4">
        <View
          className="w-full max-w-md rounded-3xl border p-5"
          style={{ backgroundColor: COLORS.surface, borderColor: COLORS.border }}
        >
          <Text className="text-xl font-semibold" style={{ color: COLORS.text }}>
            Mark this month as paid?
          </Text>
          <Text className="mt-2 text-sm" style={{ color: COLORS.textSecondary }}>
            {monthLabel} er due clear kora hoye gele, ei month er meal dashboard-e show korbe na.
          </Text>

          <View className="mt-5 flex-row justify-end gap-2">
            <Pressable
              onPress={onClose}
              className="rounded-xl px-4 py-2"
              style={{ backgroundColor: "rgba(255,255,255,0.06)" }}
            >
              <Text style={{ color: COLORS.text }}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={onConfirm}
              className="rounded-xl px-4 py-2"
              style={{ backgroundColor: COLORS.accent }}
            >
              <Text className="font-semibold" style={{ color: "#05120D" }}>Yes, Clear</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
