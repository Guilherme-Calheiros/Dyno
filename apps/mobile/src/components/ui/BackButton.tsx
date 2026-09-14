import { Pressable, StyleSheet } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import { colors } from "@/theme/tokens";

type BackButtonProps = {
    onPress?: () => void;
    href?: Href;
};

export default function BackButton({ onPress, href }: BackButtonProps) {
    const router = useRouter();

    function handlePress() {
        if (onPress) {
            onPress();
        } else if (href) {
            router.push(href);
        } else {
            router.back();
        }
    }

    return (
        <Pressable
            style={({ pressed }) => [styles.backBtn, pressed && styles.pressed]}
            onPress={handlePress}
        >
            <FontAwesome5 name="arrow-left" size={18} color={colors.surface} />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 999,
        backgroundColor: colors.primary,
        alignItems: "center",
        justifyContent: "center",
    },
    pressed: {
        opacity: 0.8,
    },
});
