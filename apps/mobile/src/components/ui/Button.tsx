import { FontAwesome5 } from "@expo/vector-icons";
import {
    Pressable,
    StyleSheet,
    StyleProp,
    Text,
    View,
    ViewStyle,
} from "react-native";
import { colors, control, font, radius } from "@/theme/tokens";

type Variant = "primary" | "secondary";

type GlyphName = keyof typeof FontAwesome5.glyphMap;

type ButtonProps = {
    label: string;
    variant?: Variant;
    icon?: GlyphName;
    disabled?: boolean;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>;
};

export default function Button({
    label,
    variant = "primary",
    icon,
    disabled = false,
    onPress,
    style,
}: ButtonProps) {
    const isPrimary = variant === "primary";

    const containerStyle: StyleProp<ViewStyle> = [
        styles.base,
        isPrimary ? styles.primary : styles.secondary,
        disabled && styles.disabled,
        style,
    ];

    return (
        <Pressable
            accessibilityRole="button"
            accessibilityState={{ disabled }}
            onPress={onPress}
            disabled={disabled}
            style={({ pressed }) => [
                containerStyle,
                pressed &&
                    !disabled &&
                    (isPrimary ? styles.pressedPrimary : styles.pressedSecondary),
            ]}
        >
            {icon ? (
                <View style={styles.iconWrap}>
                    <FontAwesome5
                        name={icon}
                        size={18}
                        color={isPrimary ? "#ffffff" : colors.ink}
                    />
                </View>
            ) : null}
            <Text
                style={[
                    styles.label,
                    isPrimary ? styles.labelPrimary : styles.labelSecondary,
                ]}
            >
                {label}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    base: {
        width: "100%",
        flexDirection: "row",
        gap: 8,
        height: control.height,
        borderRadius: radius.md,
        backgroundColor: colors.primary,
        alignItems: "center",
        justifyContent: "center",
    },
    primary: {
        backgroundColor: colors.primary,
    },
    secondary: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.line,
    },
    pressedPrimary: {
        backgroundColor: colors.primaryDeep,
    },
    pressedSecondary: {
        opacity: 0.8,
    },
    disabled: {
        opacity: 0.5,
    },
    iconWrap: {
        alignItems: "center",
        justifyContent: "center",
    },
    label: {
        fontFamily: font.semiBold,
        color: "#ffffff",
        fontSize: 16,
    },
    labelPrimary: {
        color: "#ffffff",
    },
    labelSecondary: {
        color: colors.ink,
    },
});
