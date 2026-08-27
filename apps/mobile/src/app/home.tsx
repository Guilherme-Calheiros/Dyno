import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Feather } from "@expo/vector-icons";
import Button from "@/components/ui/Button";
import { colors, font } from "@/theme/tokens";
import { authClient } from "../../lib/auth-client";

export default function Home() {
    const router = useRouter();

    const {
        data: session,
        isPending,
        error,
    } = authClient.useSession();

    async function checkSession() {
        console.log("COOKIE", await authClient.getCookie());
        console.log("SESSION", await authClient.getSession());

    }

    async function handleSignOut() {
        await authClient.signOut();
        router.replace("/");
    }

    console.log("useSession:", {
        session,
        isPending,
        error,
    });

    const userName = session?.user?.name?.split(" ")[0] ?? "Artista";

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>
                        Olá, {userName}
                    </Text>

                    <Text style={styles.subGreeting}>
                        Vamos criar algo lindo hoje?
                    </Text>
                </View>

                <View style={styles.avatar}>
                    <Text style={styles.avatarLetter}>
                        {userName.charAt(0).toUpperCase()}
                    </Text>
                </View>
            </View>

            <View style={styles.card}>
                <Feather
                    name="scissors"
                    size={32}
                    color={colors.primary}
                />

                <Text style={styles.cardTitle}>
                    Dyno
                </Text>

                <Text style={styles.cardSubtitle}>
                    Seu ateliê de bolso
                </Text>
            </View>

            <View style={styles.bottom}>
                <Button
                    label="TESTAR SESSION"
                    variant="secondary"
                    onPress={checkSession}
                />

                <Button
                    label="Sair"
                    variant="secondary"
                    onPress={handleSignOut}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 64,
        backgroundColor: colors.bg,
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    greeting: {
        fontFamily: font.semiBold,
        fontSize: 24,
        color: colors.ink,
    },
    subGreeting: {
        fontFamily: font.medium,
        fontSize: 13,
        color: colors.inkSoft,
        marginTop: 2,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 999,
        backgroundColor: colors.tint,
        alignItems: "center",
        justifyContent: "center",
    },
    avatarLetter: {
        fontFamily: font.semiBold,
        fontSize: 18,
        color: colors.primaryDeep,
    },
    card: {
        marginTop: 32,
        padding: 24,
        backgroundColor: colors.surface,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.line,
        alignItems: "center",
        gap: 8,
    },
    cardTitle: {
        fontFamily: font.semiBold,
        fontSize: 20,
        color: colors.ink,
    },
    cardSubtitle: {
        fontFamily: font.medium,
        fontSize: 14,
        color: colors.inkSoft,
    },
    bottom: {
        flex: 1,
        justifyContent: "flex-end",
        paddingBottom: 32,
    },
});
