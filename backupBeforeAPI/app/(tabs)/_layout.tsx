import { Tabs } from "expo-router";
import { Ionicons, AntDesign } from "@expo/vector-icons";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "#2278ed",
                headerStyle: {
                    backgroundColor: "#25292e",
                },
                headerShadowVisible: false,
                headerShown: false,
                headerTintColor: "#fff",
                tabBarStyle: {
                    backgroundColor: "#fff",
                },
                sceneStyle: {
                    backgroundColor: "#edebee",
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? "home-sharp" : "home-outline"}
                            color={color}
                            size={24}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="explore"
                options={{
                    title: "Explore",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? "compass" : "compass-outline"}
                            color={color}
                            size={24}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="plan"
                options={{
                    title: "Plan",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? "clipboard" : "clipboard-outline"}
                            color={color}
                            size={24}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="liked"
                options={{
                    title: "Liked",
                    tabBarIcon: ({ color, focused }) => (
                        <AntDesign name={focused ? "heart" : "hearto"} color={color} size={24} />
                    ),
                }}
            />
        </Tabs>
    );
}
