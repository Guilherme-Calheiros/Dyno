import type { ReactNode } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    View,
} from "react-native";
import { colors, control, font, radius } from "@/theme/tokens";

export type InputProps = TextInputProps & {
    label?: string;
    error?: string;
    rightIcon?: ReactNode;
};

export default function Input({
    label,
    error,
    rightIcon,
    editable,
    placeholderTextColor = colors.inkFaint,
    ...inputProps
}: InputProps) {
    const isDisabled = editable === false;

    return (
        <View style={styles.wrapper}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View
                style={[
                    styles.field,
                    isDisabled && styles.fieldDisabled,
                    error && styles.fieldError,
                ]}
            >
                <TextInput
                    style={[styles.input, isDisabled && styles.inputDisabled]}
                    placeholderTextColor={placeholderTextColor}
                    editable={isDisabled ? false : undefined}
                    {...inputProps}
                />
                {rightIcon ? <View style={styles.iconSlot}>{rightIcon}</View> : null}
            </View>
            {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        gap: 6,
    },
    label: {
        fontFamily: font.regular,
        fontSize: 14,
        color: colors.inkSoft,
    },
    input: {
        flex: 1,
        fontFamily: font.regular,
        fontSize: 16,
        padding: 0,
        color: colors.ink,
    },
    inputDisabled: {
        color: colors.inkFaint,
    },
    field: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        height: control.inputHeight,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        paddingHorizontal: 12,
    },
    fieldDisabled: {
        backgroundColor: colors.border,
        borderColor: colors.line,
    },
    fieldError: {
        borderColor: colors.danger,
    },
    iconSlot: {
        alignItems: "center",
        justifyContent: "center",
    },
    error: {
        fontFamily: font.semiBold,
        fontSize: 12,
        color: colors.danger,
    },
});
