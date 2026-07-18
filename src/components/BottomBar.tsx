import type { BottomTabBarProps } from "expo-router/build/react-navigation/bottom-tabs";
import {
  CalendarDays,
  House,
  Settings,
} from "lucide-react-native";
import { MotiView } from "moti";
import { Pressable, Text, View } from "react-native";

const ACTIVE = "#10B981";
const INACTIVE = "#7A7A7A";
const BG = "#0B0F10";
const BORDER = "#1C1F22";

const ICONS = {
  index: House,
  explore: CalendarDays,
  persistence: Settings,
};

export default function BottomBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  return (
    <View
      className="absolute bottom-5 left-4 right-4 rounded-[30px] border px-2 py-2"
      style={{
        backgroundColor: BG,
        borderColor: BORDER,

        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 20,
        shadowOffset: {
          width: 0,
          height: 10,
        },

        elevation: 20,
      }}
    >
      <View className="flex-row items-center justify-between px-5">
        {state.routes.map((route, index) => {
          const focused = state.index === index;

          const options = descriptors[route.key].options;

          const label =
            typeof options.title === "string"
              ? options.title
              : route.name;

          const Icon =
            ICONS[route.name as keyof typeof ICONS] ?? House;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              className="flex-1 items-center"
            >
              <MotiView
                animate={{
                  width: focused ? 92 : 52,
                  backgroundColor: focused
                    ? "rgba(16,185,129,0.14)"
                    : "transparent",
                }}
                transition={{
                  type: "timing",
                  duration: 220,
                }}
                className="h-14 flex-row items-center justify-center rounded-full"
              >
                <MotiView
                  animate={{
                    scale: focused ? 1.1 : 1,
                  }}
                  transition={{
                    type: "spring",
                  }}
                >
                  <Icon
                    size={22}
                    color={focused ? ACTIVE : INACTIVE}
                    strokeWidth={2.4}
                  />
                </MotiView>

                {focused && (
                  <MotiView
                    from={{
                      opacity: 0,
                      translateX: -8,
                    }}
                    animate={{
                      opacity: 1,
                      translateX: 0,
                    }}
                    transition={{
                      delay: 60,
                    }}
                  >
                    <Text
                      className="ml-2 font-semibold"
                      style={{
                        color: ACTIVE,
                      }}
                    >
                      {label}
                    </Text>
                  </MotiView>
                )}
              </MotiView>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
