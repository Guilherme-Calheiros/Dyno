import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { authClient } from "../../../lib/auth-client";
import { colors, font } from "@/theme/tokens";

type Props = {
    onPress: () => void;
};

export default function ProfileAvatarButton({ onPress }: Props) {
    const { data: session } = authClient.useSession();

    const name = session?.user?.name ?? "Artesão";
    const image = session?.user?.image;

    return (
        <Pressable
            onPress={onPress}
            accessibilityRole="button"
            accessibilityLabel="Abrir perfil"
            style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        >
            {image ? (
                <Image source={{ uri: image }} style={styles.avatar} />
            ) : (
                <View style={[styles.avatar, styles.avatarFallback]}>
                    <Text style={styles.avatarLetter}>
                        {name.charAt(0).toUpperCase()}
                    </Text>
                </View>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        width: 40,
        height: 40,
        borderRadius: 999,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonPressed: {
        opacity: 0.6,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 999,
    },
    avatarFallback: {
        backgroundColor: colors.tint,
        borderWidth: 1,
        borderColor: colors.line,
        alignItems: "center",
        justifyContent: "center",
    },
    avatarLetter: {
        fontFamily: font.semiBold,
        fontSize: 16,
        lineHeight: 20,
        textAlign: "center",
        includeFontPadding: false,
        color: colors.primaryDeep,
    },
});
