import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { Keyboard, StyleSheet, Text, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, font, radius } from "@/theme/tokens";

type ToastType = "error" | "success" | "info";

type ToastData = {
    message: string;
    type: ToastType;
};

type ToastContextValue = {
    show: (message: string, type?: ToastType) => void;
    error: (message: string) => void;
    success: (message: string) => void;
    info: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

const ICON_MAP: Record<ToastType, { name: React.ComponentProps<typeof FontAwesome5>["name"]; color: string }> = {
    error: { name: "exclamation-circle", color: colors.danger },
    success: { name: "check-circle", color: "#2d9c3c" },
    info: { name: "info-circle", color: colors.primary },
};

const AUTO_DISMISS_MS = 3000;

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toast, setToast] = useState<ToastData | null>(null);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);
    const insets = useSafeAreaInsets();

    useEffect(() => {
        const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
            setKeyboardHeight(e.endCoordinates.height);
        });
        const hideSub = Keyboard.addListener("keyboardDidHide", () => {
            setKeyboardHeight(0);
        });
        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);

    const show = useCallback((message: string, type: ToastType = "error") => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setToast({ message, type });
        timeoutRef.current = setTimeout(() => setToast(null), AUTO_DISMISS_MS);
    }, []);

    const error = useCallback((msg: string) => show(msg, "error"), [show]);
    const success = useCallback((msg: string) => show(msg, "success"), [show]);
    const info = useCallback((msg: string) => show(msg, "info"), [show]);

    const icon = toast ? ICON_MAP[toast.type] : ICON_MAP.error;

    return (
        <ToastContext.Provider value={{ show, error, success, info }}>
            {children}
            {toast && (
                <Animated.View
                    key={toast.message + Date.now()}
                    entering={FadeInUp.duration(150)}
                    exiting={FadeOutDown.duration(150)}
                    style={[styles.container, { bottom: insets.bottom + keyboardHeight + 16 }]}
                >
                    <View style={styles.content}>
                        <View style={[styles.iconWrap, { backgroundColor: icon.color + "18" }]}>
                            <FontAwesome5 name={icon.name} size={16} color={icon.color} />
                        </View>
                        <Text style={styles.message} numberOfLines={2}>
                            {toast.message}
                        </Text>
                    </View>
                </Animated.View>
            )}
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used within a ToastProvider");
    return ctx;
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        left: 16,
        right: 16,
        zIndex: 9999,
        elevation: 9999,
    },
    content: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        backgroundColor: colors.surface,
        paddingHorizontal: 16,
        paddingVertical: 14,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: colors.line,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 6,
    },
    iconWrap: {
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: "center",
        justifyContent: "center",
    },
    message: {
        flex: 1,
        fontFamily: font.medium,
        fontSize: 14,
        color: colors.ink,
    },
});
