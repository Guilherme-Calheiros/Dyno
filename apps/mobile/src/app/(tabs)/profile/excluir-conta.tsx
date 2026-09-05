import { useState } from "react";
import {
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useToast } from "@/components/ui/Toast";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { authClient } from "../../../../lib/auth-client";
import { colors, font } from "@/theme/tokens";

export default function ExcluirConta() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const toast = useToast();
    const [loading, setLoading] = useState(false);
    const [confirmVisible, setConfirmVisible] = useState(false);

    async function excluir() {
        setLoading(true);
        try {
            const { error } = await authClient.deleteUser();

            if (error) {
                toast.error(error.message ?? "Erro ao excluir conta");
                return;
            }

            toast.success("Conta excluída");
            router.replace("/login");
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Erro ao excluir conta");
        } finally {
            setLoading(false);
        }
    }

    function confirmar() {
        setConfirmVisible(true);
    }

    return (
        <>
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >
                <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
                    <View style={styles.header}>
                        <Pressable style={styles.backBtn} onPress={() => router.back()}>
                            <FontAwesome5 name="arrow-left" size={18} color={colors.ink} />
                        </Pressable>
                        <Text style={styles.headerTitle}>Excluir conta</Text>
                    </View>

                    <View style={styles.warningWrap}>
                        <FontAwesome5 name="exclamation-triangle" size={22} color={colors.danger} />
                        <Text style={styles.warningTitle}>Zona perigosa</Text>
                    </View>

                    <Text style={styles.description}>
                        Ao excluir sua conta, todos os seus dados, produções e receitas serão
                        removidos permanentemente. Essa ação não pode ser desfeita.
                    </Text>

                    <Pressable
                        style={({ pressed }) => [
                            styles.dangerButton,
                            pressed && styles.dangerButtonPressed,
                            loading && styles.dangerButtonDisabled,
                        ]}
                        onPress={confirmar}
                        disabled={loading}
                    >
                        <FontAwesome5 name="trash-alt" size={18} color={colors.danger} />
                        <Text style={styles.dangerLabel}>Excluir conta</Text>
                    </Pressable>
                </View>
            </ScrollView>

            <ConfirmDialog
                visible={confirmVisible}
                title="Excluir conta"
                message="Esta ação é permanente. Todos os seus dados serão apagados e não haverá como recuperar. Deseja continuar?"
                icon="exclamation-triangle"
                confirmLabel="Excluir"
                cancelLabel="Cancelar"
                destructive
                loading={loading}
                onCancel={() => setConfirmVisible(false)}
                onClose={() => setConfirmVisible(false)}
                onConfirm={() => {
                    setConfirmVisible(false);
                    excluir();
                }}
            />
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingBottom: 32,
        backgroundColor: "#faf7fb",
        gap: 14,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        height: 40,
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 999,
        backgroundColor: colors.surface,
        alignItems: "center",
        justifyContent: "center",
    },
    headerTitle: {
        fontFamily: font.semiBold,
        fontSize: 22,
        color: colors.ink,
    },
    warningWrap: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        marginTop: 8,
    },
    warningTitle: {
        fontFamily: font.semiBold,
        fontSize: 18,
        color: colors.danger,
    },
    description: {
        fontFamily: font.regular,
        fontSize: 15,
        lineHeight: 22,
        color: colors.inkSoft,
    },
    dangerButton: {
        marginTop: 8,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        height: 52,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.danger,
        backgroundColor: colors.surface,
    },
    dangerButtonPressed: {
        backgroundColor: colors.rose,
    },
    dangerButtonDisabled: {
        opacity: 0.5,
    },
    dangerLabel: {
        fontFamily: font.semiBold,
        fontSize: 16,
        color: colors.danger,
    },
});