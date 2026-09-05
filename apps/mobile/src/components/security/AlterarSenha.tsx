import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import PasswordInput from "@/components/ui/PasswordInput";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { authClient } from "../../../lib/auth-client";
import { changePasswordSchema, type ChangePasswordFormData } from "@/lib/validations";
import { colors, font } from "@/theme/tokens";

export default function AlterarSenha() {
    const router = useRouter();
    const toast = useToast();

    const [senhaAtual, setSenhaAtual] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [errors, setErrors] = useState<Partial<Record<keyof ChangePasswordFormData, string>>>({});
    const [loading, setLoading] = useState(false);

    async function salvar() {
        const result = changePasswordSchema.safeParse({
            currentPassword: senhaAtual,
            newPassword: novaSenha,
            confirmPassword: confirmarSenha,
        });

        if (!result.success) {
            const fieldErrors: Partial<Record<keyof ChangePasswordFormData, string>> =
                {};
            result.error.issues.forEach((issue) => {
                const field = issue.path[0] as keyof ChangePasswordFormData;
                fieldErrors[field] = issue.message;
            });
            setErrors(fieldErrors);
            return;
        }

        setErrors({});
        setLoading(true);

        try {
            const { error } = await authClient.changePassword({
                currentPassword: result.data.currentPassword,
                newPassword: result.data.newPassword,
                revokeOtherSessions: true,
            });

            if (error) {
                toast.error(error.message ?? "Erro ao alterar senha");
                return;
            }

            toast.success("Senha alterada");
            router.back();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Erro ao alterar senha");
        } finally {
            setLoading(false);
        }
    }

    return (
        <View style={styles.wrapper}>
            <Text style={styles.sectionTitle}>Mudar senha</Text>

            <View style={styles.formCard}>
                <PasswordInput
                    label="Senha atual"
                    placeholder="••••••••"
                    onChangeText={setSenhaAtual}
                    value={senhaAtual}
                    error={errors.currentPassword}
                />
                <PasswordInput
                    label="Nova senha"
                    placeholder="••••••••"
                    onChangeText={setNovaSenha}
                    value={novaSenha}
                    error={errors.newPassword}
                />
                <PasswordInput
                    label="Confirmar nova senha"
                    placeholder="••••••••"
                    onChangeText={setConfirmarSenha}
                    value={confirmarSenha}
                    error={errors.confirmPassword}
                />
            </View>

            <Button
                label="Atualizar senha"
                onPress={salvar}
                disabled={loading}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        gap: 14,
    },
    sectionTitle: {
        fontFamily: font.semiBold,
        fontSize: 18,
        color: colors.ink,
    },
    formCard: {
        backgroundColor: colors.surface,
        borderRadius: 18,
        padding: 14,
        gap: 14,
    },
});
