import { useState } from "react";
import { Text, View, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Image } from "react-native";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import BackButton from "@/components/ui/BackButton";
import { useToast } from "@/components/ui/Toast";
import { colors, font } from "@/theme/tokens";
import appName from "@/assets/images/app-name.png";
import { useRouter } from "expo-router";
import { authClient } from "../../lib/auth-client";
import { forgotPasswordSchema, type ForgotPasswordFormData } from "@/lib/validations";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [errors, setErrors] = useState<Partial<Record<keyof ForgotPasswordFormData, string>>>({});
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const toast = useToast();

    async function handleResetPassword() {
        const result = forgotPasswordSchema.safeParse({ email });

        if (!result.success) {
            const fieldErrors: Partial<
                Record<keyof ForgotPasswordFormData, string>
            > = {};
            result.error.issues.forEach((issue) => {
                const field = issue.path[0] as keyof ForgotPasswordFormData;
                fieldErrors[field] = issue.message;
            });
            setErrors(fieldErrors);
            return;
        }

        setErrors({});
        setLoading(true);

        try {
            const { error } = await authClient.emailOtp.requestPasswordReset({
                email: result.data.email,
            });

            if (error) {
                toast.error(error.message ?? "Erro ao enviar código");
                return;
            }

            router.push({ pathname: "/verify-otp", params: { email: result.data.email } });
        } catch (err) {
            toast.error(
                err instanceof Error ? err.message : "Erro desconhecido"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.container}>
                    <BackButton href="/" />

                    <View style={styles.content}>
                        <View style={styles.brandWrap}>
                            <Image source={appName} style={styles.appName} />
                        </View>

                        <View style={styles.header}>
                            <Text style={styles.title}>
                                Esqueceu a senha?
                            </Text>
                            <Text style={styles.subtitle}>
                                Informe seu e-mail para receber um código de
                                verificação.
                            </Text>
                        </View>

                        <View style={styles.form}>
                            <Input
                                label="E-mail"
                                placeholder="Seu E-mail"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                                error={errors.email}
                            />

                            <Button
                                label="Enviar código"
                                onPress={handleResetPassword}
                                disabled={loading}
                            />
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 24,
        paddingVertical: 48,
        backgroundColor: colors.bg,
        justifyContent: "center",
    },
    content: {
        gap: 16,
    },
    appName: {
        width: 180,
        height: 80,
        resizeMode: "contain",
    },
    brandWrap: {
        alignItems: "center",
        marginBottom: 24,
    },
    header: {
        gap: 4,
    },
    title: {
        fontFamily: font.semiBold,
        fontSize: 24,
        color: colors.ink,
    },
    subtitle: {
        fontFamily: font.medium,
        fontSize: 12,
        color: colors.inkSoft,
    },
    form: {
        gap: 12,
    },
});
