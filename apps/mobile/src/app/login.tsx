import { useState } from "react";
import { Text, View, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Image } from "react-native";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import PasswordInput from "@/components/ui/PasswordInput";
import SocialSignIn from "@/components/ui/SocialSignIn";
import { useToast } from "@/components/ui/Toast";
import { colors, font } from "@/theme/tokens";
import appName from "@/assets/images/app-name.png";
import { Link, useRouter } from "expo-router";
import { authClient } from "../../lib/auth-client";
import { loginSchema, type LoginFormData } from "@/lib/validations";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const toast = useToast();

    async function handleSignIn() {
        const result = loginSchema.safeParse({ email, password });

        if (!result.success) {
            const fieldErrors: Partial<Record<keyof LoginFormData, string>> = {};
            result.error.issues.forEach((issue) => {
                const field = issue.path[0] as keyof LoginFormData;
                fieldErrors[field] = issue.message;
            });
            setErrors(fieldErrors);
            return;
        }

        setErrors({});
        setLoading(true);

        try {
            const { data, error } = await authClient.signIn.email({
                email: result.data.email,
                password: result.data.password,
            });

            if (error) {
                if (error.status === 429) {
                    toast.error("Muitas tentativas. Tente novamente em alguns minutos.");
                    return;
                }
                toast.error(error.message ?? "Erro ao entrar");
                return;
            }

router.replace("/");
        } catch (err) {
            toast.error(
                err instanceof Error ? err.message : "Erro ao entrar"
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
                    <View style={styles.content}>
                        <View style={styles.brandWrap}>
                            <Image source={appName} style={styles.appName} />
                        </View>

                        <View style={styles.header}>
                            <Text style={styles.title}>
                                Bem-vindo de volta!
                            </Text>
                            <Text style={styles.subtitle}>
                                Entre para continuar suas produções.
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
                            <PasswordInput
                                label="Senha"
                                placeholder="••••••••"
                                value={password}
                                onChangeText={setPassword}
                                error={errors.password}
                            />

                            <Link href="/forgot-password" style={styles.forgot}>
                                Esqueci minha senha
                            </Link>

                            <Button
                                label="Entrar"
                                onPress={handleSignIn}
                                disabled={loading}
                            />

                            <View style={styles.divider}>
                                <View style={styles.dividerLine} />
                                <Text style={styles.dividerText}>ou</Text>
                                <View style={styles.dividerLine} />
                            </View>

                            <SocialSignIn />
                        </View>
                    </View>

                    <Text style={styles.footer}>
                        Não tem conta?{" "}
                        <Link style={styles.link} href="/signup">
                            Criar conta
                        </Link>
                    </Text>
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
    forgot: {
        alignSelf: "flex-end",
        fontFamily: font.bold,
        fontSize: 12,
        color: colors.primary,
        marginBottom: 16,
    },
    divider: {
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        paddingVertical: 4,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: colors.line,
    },
    dividerText: {
        fontFamily: font.bold,
        fontSize: 12,
        color: colors.inkFaint,
    },
    footer: {
        textAlign: "center",
        fontFamily: font.medium,
        fontSize: 12,
        color: colors.inkSoft,
        marginTop: 24,
    },
    link: {
        fontFamily: font.bold,
        color: colors.primary,
    },
});
