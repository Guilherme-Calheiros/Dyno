import { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { colors, font } from "@/theme/tokens";
import { useRouter } from "expo-router";
import { authClient } from "../../../lib/auth-client";

export default function Index() {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const toast = useToast();

    const { data: session } = authClient.useSession();

    async function handleSignOut() {
        setLoading(true);
        try {
            await authClient.signOut({
                fetchOptions: {
                    onSuccess: () => {
                        router.reload();
                    },
                },
            });
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Erro ao sair");
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.eyebrow}>Você está logado</Text>
                <Text style={styles.title}>Bem-vindo, {session?.user?.name ?? "artesão"}!</Text>
                <Text style={styles.subtitle}>{session?.user?.email}</Text>

                <Button
                    label="Sair"
                    variant="secondary"
                    onPress={handleSignOut}
                    disabled={loading}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingVertical: 48,
        backgroundColor: colors.bg,
        justifyContent: "space-between",
    },
    content: {
        flex: 1,
        justifyContent: "center",
        gap: 8,
    },
    eyebrow: {
        fontFamily: font.bold,
        fontSize: 12,
        color: colors.primary,
        textTransform: "uppercase",
    },
    title: {
        fontFamily: font.semiBold,
        fontSize: 24,
        color: colors.ink,
    },
    subtitle: {
        fontFamily: font.medium,
        fontSize: 14,
        color: colors.inkSoft,
        marginBottom: 24,
    },
});
