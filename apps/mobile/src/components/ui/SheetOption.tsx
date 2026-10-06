import { Pressable, StyleSheet, Text } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { colors, font } from "@/theme/tokens";

type GlyphName = keyof typeof FontAwesome5.glyphMap;

type SheetOptionProps = {
    icon: GlyphName;
    label: string;
    onPress: () => void;
    tone?: "danger" | "neutral";
};

export default function SheetOption({
    icon,
    label,
    onPress,
    tone = "danger",
}: SheetOptionProps) {
    const isDanger = tone === "danger";

    return (
        <Pressable
            style={({ pressed }) => [
                styles.option,
                pressed && styles.optionPressed,
            ]}
            onPress={onPress}
            accessibilityRole="button"
        >
            <FontAwesome5
                name={icon}
                size={16}
                color={isDanger ? colors.danger : colors.inkSoft}
            />
            <Text style={[styles.label, !isDanger && styles.labelNeutral]}>
                {label}
            </Text>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    option: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        alignSelf: "stretch",
        backgroundColor: colors.surface,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 14,
    },

    optionPressed: {
        backgroundColor: colors.rose,
    },

    label: {
        fontFamily: font.semiBold,
        fontSize: 16,
        color: colors.danger,
    },

    labelNeutral: {
        color: colors.ink,
    },
});