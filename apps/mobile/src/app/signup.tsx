import { useState } from "react";
import { Text, View, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Image } from "react-native";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import BackButton from "@/components/ui/BackButton";
import { useToast } from "@/components/ui/Toast";
import { colors, font } from "@/theme/tokens";
import appName from "@/assets/images/app-name.png";
import { Link, useRouter } from "expo-router";
import { authClient } from "../../lib/auth-client";
import { signupSchema, type SignupFormData } from "@/lib/validations";

export default function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState<Partial<Record<keyof SignupFormData, string>>>({});
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const toast = useToast();

    async function handleSignup() {
        const result = signupSchema.safeParse({
            name,
            email,
            password,
            confirmPassword,
        });

        if (!result.success) {
            const fieldErrors: Partial<Record<keyof SignupFormData, string>> =
                {};
            result.error.issues.forEach((issue) => {
                const field = issue.path[0] as keyof SignupFormData;
                fieldErrors[field] = issue.message;
            });
            setErrors(fieldErrors);
            return;
        }

        setErrors({});
        setLoading(true);

        try {
            const { data, error } = await authClient.signUp.email({
                name: result.data.name,
                email: result.data.email,
                password: result.data.password,
            });

            if (error) {
                toast.error(error.message ?? "Erro ao criar conta");
                return;
            }

            router.replace("/home");
        } catch (err) {
            toast.error(
                err instanceof Error ? err.message : "Erro desconhecido"
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleGoogleSignUp() {
        try {
            const { error } = await authClient.signIn.social({
                provider: "google",
                callbackURL: "/home",
            });

            if (error) {
                toast.error(error.message ?? "Erro ao criar conta");
                return;
            }

            router.replace("/home");
        } catch (err) {
            toast.error(
                err instanceof Error ? err.message : "Erro desconhecido"
            );
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
                            <Text style={styles.title}>Criar conta</Text>
                            <Text style={styles.subtitle}>
                                Comece a registrar suas produções hoje.
                            </Text>
                        </View>

                        <View style={styles.form}>
                            <Input
                                label="Nome"
                                placeholder="Seu nome"
                                onChangeText={setName}
                                value={name}
                                error={errors.name}
                            />
                            <Input
                                label="E-mail"
                                placeholder="Seu E-mail"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                onChangeText={setEmail}
                                value={email}
                                error={errors.email}
                            />
                            <Input
                                label="Senha"
                                placeholder="••••••••"
                                secureTextEntry
                                onChangeText={setPassword}
                                value={password}
                                error={errors.password}
                            />
                            <Input
                                label="Confirmar senha"
                                placeholder="••••••••"
                                secureTextEntry
                                onChangeText={setConfirmPassword}
                                value={confirmPassword}
                                error={errors.confirmPassword}
                            />

                            <Button
                                label="Criar conta"
                                onPress={handleSignup}
                                disabled={loading}
                            />

                            <View style={styles.divider}>
                                <View style={styles.dividerLine} />
                                <Text style={styles.dividerText}>ou</Text>
                                <View style={styles.dividerLine} />
                            </View>

                            <Button
                                label="Criar conta com Google"
                                variant="secondary"
                                icon="google"
                                onPress={handleGoogleSignUp}
                            />
                        </View>
                    </View>

                    <Text style={styles.footer}>
                        Já tem conta?{" "}
                        <Link style={styles.link} href="/">
                            Entrar
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
