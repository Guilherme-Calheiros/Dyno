import {
    StyleSheet,
    Text,
    TextInput,
    TextInputProps,
    View,
} from "react-native";
import { colors, control, font, radius } from "@/theme/tokens";

type InputProps = TextInputProps & {
    label?: string;
    error?: string;
};

export default function Input({
    label,
    error,
    placeholderTextColor = colors.inkFaint,
    ...inputProps
}: InputProps) {
    return (
        <View style={styles.wrapper}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TextInput
                style={[styles.input, error && styles.inputError]}
                placeholderTextColor={placeholderTextColor}
                {...inputProps}
            />
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
        width: "100%",
        fontFamily: font.regular,
        fontSize: 16,
        height: control.inputHeight,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        padding: 12,
        color: colors.ink,
    },
    inputError: {
        borderColor: colors.danger,
    },
    error: {
        fontFamily: font.semiBold,
        fontSize: 12,
        color: colors.danger,
    },
});
