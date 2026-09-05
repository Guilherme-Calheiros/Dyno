import { Pressable, Modal, StyleSheet, Text, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { colors, font, radius } from "@/theme/tokens";

type GlyphName = keyof typeof FontAwesome5.glyphMap;

type ConfirmDialogProps = {
    visible: boolean;
    title: string;
    message: string;
    icon?: GlyphName;
    confirmLabel?: string;
    cancelLabel?: string;
    destructive?: boolean;
    loading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
    onClose?: () => void;
};

export default function ConfirmDialog({
    visible,
    title,
    message,
    icon = "question-circle",
    confirmLabel = "Confirmar",
    cancelLabel = "Cancelar",
    destructive = false,
    loading = false,
    onConfirm,
    onCancel,
    onClose,
}: ConfirmDialogProps) {
    const close = onClose ?? onCancel;
    const confirmColor = destructive ? colors.danger : colors.primary;
    const iconBg = destructive ? colors.rose : colors.tint;
    const iconColor = destructive ? colors.danger : colors.primaryDeep;

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            statusBarTranslucent
            onRequestClose={close}
            accessibilityViewIsModal
        >
            <Pressable style={styles.backdrop} onPress={close}>
                <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
                    <View style={[styles.iconCircle, { backgroundColor: iconBg }]}>
                        <FontAwesome5 name={icon} size={22} color={iconColor} />
                    </View>

                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    <View style={styles.actions}>
                        <Pressable
                            style={({ pressed }) => [
                                styles.button,
                                styles.cancelButton,
                                pressed && styles.buttonPressed,
                                loading && styles.buttonDisabled,
                            ]}
                            onPress={onCancel}
                            disabled={loading}
                            accessibilityRole="button"
                        >
                            <Text style={[styles.buttonLabel, styles.cancelLabel]}>
                                {cancelLabel}
                            </Text>
                        </Pressable>

                        <Pressable
                            style={({ pressed }) => [
                                styles.button,
                                { backgroundColor: confirmColor },
                                pressed && styles.buttonPressed,
                                loading && styles.buttonDisabled,
                            ]}
                            onPress={onConfirm}
                            disabled={loading}
                            accessibilityRole="button"
                        >
                            <Text style={[styles.buttonLabel, styles.confirmLabel]}>
                                {confirmLabel}
                            </Text>
                        </Pressable>
                    </View>
                </Pressable>
            </Pressable>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.45)",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
    },
    card: {
        width: "100%",
        maxWidth: 380,
        backgroundColor: colors.surface,
        borderRadius: 20,
        padding: 22,
        alignItems: "center",
        gap: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 12,
    },
    iconCircle: {
        width: 46,
        height: 46,
        borderRadius: 999,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 4,
    },
    title: {
        fontFamily: font.semiBold,
        fontSize: 18,
        color: colors.ink,
        textAlign: "center",
    },
    message: {
        fontFamily: font.regular,
        fontSize: 15,
        lineHeight: 22,
        color: colors.inkSoft,
        textAlign: "center",
        marginBottom: 8,
    },
    actions: {
        flexDirection: "row",
        gap: radius.md,
        alignSelf: "stretch",
    },
    button: {
        flex: 1,
        height: 50,
        borderRadius: radius.md,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 1,
    },
    cancelButton: {
        backgroundColor: colors.surface,
        borderColor: colors.border,
    },
    buttonPressed: {
        opacity: 0.8,
    },
    buttonDisabled: {
        opacity: 0.5,
    },
    buttonLabel: {
        fontFamily: font.semiBold,
        fontSize: 16,
    },
    cancelLabel: {
        color: colors.ink,
    },
    confirmLabel: {
        color: "#ffffff",
    },
});
