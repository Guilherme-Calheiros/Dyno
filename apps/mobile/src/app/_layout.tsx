import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, useFonts } from "@expo-google-fonts/inter";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { authClient } from "../../lib/auth-client";
import { ToastProvider } from "@/components/ui/Toast";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded, error] = useFonts({
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold,
    });

    const { data: session, isPending } = authClient.useSession();

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }

    if (isPending) {
        return null;
    }

    return (
        <ToastProvider>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Protected guard={!!session}>
                    <Stack.Screen
                        name="(tabs)"
                        options={{ headerShown: false }}
                    />
                </Stack.Protected>

                <Stack.Protected guard={!session}>
                    <Stack.Screen name="login" />
                    <Stack.Screen name="signup" />
                    <Stack.Screen name="forgot-password" />
                    <Stack.Screen name="verify-otp" />
                </Stack.Protected>
            </Stack>
        </ToastProvider>
    );
}