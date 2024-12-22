import { Stack } from "expo-router";

export default function RootLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="detail/[id]" />
            <Stack.Screen name="day/[id]" />
            <Stack.Screen name="ingredientSearch" />
            <Stack.Screen name="cart" />
            <Stack.Screen name="+not-found" />
        </Stack>
    );
}
