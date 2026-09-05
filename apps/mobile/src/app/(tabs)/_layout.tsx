import { Tabs } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, font } from "@/theme/tokens";

export default function TabLayout() {
    const insets = useSafeAreaInsets();

    return (
        <Tabs
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: colors.primary,
                tabBarInactiveTintColor: colors.inkFaint,
                tabBarStyle: {
                    backgroundColor: colors.surface,
                    borderTopColor: colors.line,
                    paddingBottom: insets.bottom,
                    height: 56 + insets.bottom,
                },
                tabBarLabelStyle: {
                    fontFamily: font.semiBold,
                    fontSize: 11,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Início",
                    tabBarIcon: ({ color }) => (
                        <FontAwesome5 name="home" color={color} size={20} />
                    ),
                }}
            />
            <Tabs.Screen
                name="recipes"
                options={{
                    title: "Receitas",
                    tabBarIcon: ({ color }) => (
                        <FontAwesome5 name="book-open" color={color} size={20} />
                    ),
                }}
            />
            <Tabs.Screen
                name="productions"
                options={{
                    title: "Produções",
                    tabBarIcon: ({ color }) => (
                        <FontAwesome5 name="buffer" color={color} size={20} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Perfil",
                    tabBarIcon: ({ color }) => (
                        <FontAwesome5 name="user" color={color} size={20} />
                    ),
                }}
            />
        </Tabs>
    );
}