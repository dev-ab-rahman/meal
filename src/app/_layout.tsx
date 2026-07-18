import BottomBar from "@/components/BottomBar";
import { MealProvider } from "@/context/meal-context";
import { Tabs } from "expo-router";


import "../../global.css";


export default function TabLayout() {
  return (
    <MealProvider>
      <Tabs
        tabBar={(props) => <BottomBar {...props} />}
        screenOptions={{
          headerShown: false,
          sceneStyle: {
            backgroundColor: "#050607",
          },
          tabBarStyle: {
            backgroundColor: "#050607",
          },
          tabBarHideOnKeyboard: true,
          animation: "none",
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Home",
          }}
        />

        <Tabs.Screen
          name="explore"
          options={{
            title: "Tracker",
          }}
        />
        <Tabs.Screen
          name="persistence"
          options={{
            title: "Settings",
          }}
        />
      </Tabs>
    </MealProvider>
  );
}
