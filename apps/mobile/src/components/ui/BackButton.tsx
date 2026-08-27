import { StyleSheet, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Href, Link } from "expo-router";
import { colors } from "@/theme/tokens";

type BackButtonProps = {
    href: Href;
};

export default function BackButton({ href }: BackButtonProps) {
    return (
        <View style={styles.topRow}>
            <Link href={href}>
                <View style={styles.backBtn}>
                    <FontAwesome5
                        name="arrow-left"
                        size={18}
                        color={colors.ink}
                    />
                </View>
            </Link>
        </View>
    );
}

const styles = StyleSheet.create({
    topRow: {
        position: "absolute",
        top: 48,
        left: 16,
    },
    backBtn: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
    },
});
