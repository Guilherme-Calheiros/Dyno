import {
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    useFonts,
} from "@expo-google-fonts/inter";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { authClient } from "../../lib/auth-client";
import { ToastProvider } from "@/components/ui/Toast";

SplashScreen.preventAutoHideAsync();

const publicRoutes = [
    "/",
    "/signup",
    "/forgot-password",
    "/verify-otp",
];

export default function RootLayout() {
    const [loaded, error] = useFonts({
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_700Bold,
    });

    const { data: session, isPending } = authClient.useSession();

    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    // useEffect(() => {
    //     console.log("[LAYOUT]", {
    //         loaded,
    //         isPending,
    //         hasSession: !!session,
    //         route: "/" + segments.join("/"),
    //     });

    //     if (!loaded || isPending) return;

    //     const currentRoute = "/" + segments.join("/");
    //     const isPublic = publicRoutes.includes(currentRoute);

    //     if (session && isPublic) {
    //         router.replace("/home");
    //         return;
    //     }

    //     if (!session && !isPublic) {
    //         router.replace("/");
    //     }
    // }, [
    //     loaded,
    //     isPending,
    //     session,
    //     segments,
    //     router,
    // ]);

    if (!loaded && !error) {
        return null;
    }

    return (
        <ToastProvider>
            <Stack screenOptions={{ headerShown: false }} />
        </ToastProvider>
    );
}
