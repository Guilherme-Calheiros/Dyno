import { Pressable, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { colors } from "@/theme/tokens";

type IconName = keyof typeof FontAwesome5.glyphMap;

type Props = {
    icon: IconName;
    onPress: () => void;
    label: string;
    filled?: boolean;
};

export default function IconCircleButton({
    icon,
    onPress,
    label,
    filled = false,
}: Props) {
    return (
        <Pressable
            style={({ pressed }) => [
                styles.base,
                filled && styles.filled,
                pressed && styles.pressed,
            ]}
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel={label}
        >
            <FontAwesome5
                name={icon}
                size={14}
                color={filled ? "#ffffff" : colors.inkSoft}
            />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    base: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: "center",
        justifyContent: "center",
    },
    filled: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    pressed: {
        opacity: 0.8,
    },
});