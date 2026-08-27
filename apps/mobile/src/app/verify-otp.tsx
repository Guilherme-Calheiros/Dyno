import { useState, useRef, useEffect } from "react";
import { Text, View, ScrollView, StyleSheet, KeyboardAvoidingView, Platform, Image, TextInput } from "react-native";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import BackButton from "@/components/ui/BackButton";
import { useToast } from "@/components/ui/Toast";
import { colors, font, radius } from "@/theme/tokens";
import appName from "@/assets/images/app-name.png";
import { useRouter, useLocalSearchParams } from "expo-router";
import { authClient } from "../../lib/auth-client";
import { resetPasswordSchema, type ResetPasswordFormData } from "@/lib/validations";

const OTP_LENGTH = 6;

export default function VerifyOtp() {
    const { email } = useLocalSearchParams<{ email: string }>();
    const router = useRouter();
    const toast = useToast();

    const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(""));
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errors, setErrors] = useState<Partial<Record<keyof ResetPasswordFormData, string>>>({});
    const [loading, setLoading] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [resendCooldown, setResendCooldown] = useState(0);
    const inputRefs = useRef<(TextInput | null)[]>([]);
    const cooldownRef = useRef<ReturnType<typeof setInterval>>(null);

    function handleOtpChange(text: string, index: number) {
        if (text.length > 1) {
            text = text.slice(-1);
        }

        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        if (text && index < OTP_LENGTH - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    }

    function handleOtpKeyPress(key: string, index: number) {
        if (key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    }

    useEffect(() => {
        if (resendCooldown <= 0) return;
        cooldownRef.current = setInterval(() => {
            setResendCooldown((prev) => {
                if (prev <= 1) {
                    clearInterval(cooldownRef.current);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(cooldownRef.current);
    }, [resendCooldown]);

    async function handleResendOtp() {
        if (resendCooldown > 0) return;

        try {
            const { error } = await authClient.emailOtp.requestPasswordReset({
                email: email!,
            });

            if (error) {
                toast.error(error.message ?? "Erro ao reenviar código");
                return;
            }

            toast.success("Código reenviado!");
            setResendCooldown(60);
            setOtp(Array(OTP_LENGTH).fill(""));
            inputRefs.current[0]?.focus();
        } catch (err) {
            toast.error(
                err instanceof Error ? err.message : "Erro desconhecido"
            );
        }
    }

    async function handleVerifyOtp() {
        const otpString = otp.join("");

        if (otpString.length !== OTP_LENGTH) {
            toast.error("Informe o código completo de 6 dígitos");
            return;
        }

        setLoading(true);

        try {
            const { error } = await authClient.emailOtp.checkVerificationOtp({
                email: email!,
                otp: otpString,
                type: "forget-password",
            });

            if (error) {
                toast.error(error.message ?? "Código inválido ou expirado");
                return;
            }

            setOtpVerified(true);
        } catch (err) {
            toast.error(
                err instanceof Error ? err.message : "Erro desconhecido"
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleResetPassword() {
        const result = resetPasswordSchema.safeParse({ password, confirmPassword });

        if (!result.success) {
            const fieldErrors: Partial<Record<keyof ResetPasswordFormData, string>> = {};
            result.error.issues.forEach((issue) => {
                const field = issue.path[0] as keyof ResetPasswordFormData;
                fieldErrors[field] = issue.message;
            });
            setErrors(fieldErrors);
            return;
        }

        setErrors({});
        setLoading(true);

        try {
            const { error } = await authClient.emailOtp.resetPassword({
                email: email!,
                otp: otp.join(""),
                password: result.data.password,
            });

            if (error) {
                toast.error(error.message ?? "Erro ao redefinir senha");
                return;
            }

            toast.success("Senha redefinida com sucesso!");
            setTimeout(() => router.replace("/"), 1500);
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
                    <BackButton href="/forgot-password" />

                    <View style={styles.content}>
                        <View style={styles.brandWrap}>
                            <Image source={appName} style={styles.appName} />
                        </View>

                        <View style={styles.header}>
                            <Text style={styles.title}>
                                {otpVerified ? "Nova senha" : "Verificar código"}
                            </Text>
                            <Text style={styles.subtitle}>
                                {otpVerified
                                    ? "Insira sua nova senha abaixo."
                                    : <>Enviamos um código de 6 dígitos para{"\n"}<Text style={{ fontFamily: font.bold }}>{email}</Text></>
                                }
                            </Text>
                        </View>

                        {!otpVerified ? (
                            <View style={styles.form}>
                                <View style={styles.otpContainer}>
                                    {otp.map((digit, index) => (
                                        <TextInput
                                            key={index}
                                            ref={(ref) => { inputRefs.current[index] = ref; }}
                                            style={[styles.otpInput, digit ? styles.otpInputFilled : null]}
                                            value={digit}
                                            onChangeText={(text) => handleOtpChange(text, index)}
                                            onKeyPress={({ nativeEvent }) => handleOtpKeyPress(nativeEvent.key, index)}
                                            keyboardType="number-pad"
                                            maxLength={1}
                                            selectTextOnFocus
                                        />
                                    ))}
                                </View>

                                {resendCooldown > 0 ? (
                                    <Text style={styles.cooldown}>
                                        Reenviar em {resendCooldown}s
                                    </Text>
                                ) : (
                                    <Text style={styles.resend} onPress={handleResendOtp}>
                                        Reenviar código
                                    </Text>
                                )}

                                <Button
                                    label="Verificar código"
                                    onPress={handleVerifyOtp}
                                    disabled={loading}
                                />
                            </View>
                        ) : (
                            <View style={styles.form}>
                                <Input
                                    label="Nova senha"
                                    placeholder="••••••••"
                                    secureTextEntry
                                    value={password}
                                    onChangeText={setPassword}
                                    error={errors.password}
                                />

                                <Input
                                    label="Confirmar senha"
                                    placeholder="••••••••"
                                    secureTextEntry
                                    value={confirmPassword}
                                    onChangeText={setConfirmPassword}
                                    error={errors.confirmPassword}
                                />

                                <Button
                                    label="Redefinir senha"
                                    onPress={handleResetPassword}
                                    disabled={loading}
                                />
                            </View>
                        )}
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
    otpContainer: {
        flexDirection: "row",
        justifyContent: "center",
        gap: 8,
        marginBottom: 8,
    },
    otpInput: {
        width: 48,
        height: 52,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: radius.md,
        textAlign: "center",
        fontFamily: font.semiBold,
        fontSize: 20,
        color: colors.ink,
        backgroundColor: colors.surface,
    },
    otpInputFilled: {
        borderColor: colors.primary,
        backgroundColor: colors.tint,
    },
    resend: {
        fontFamily: font.bold,
        fontSize: 13,
        color: colors.primary,
        textAlign: "center",
    },
    cooldown: {
        fontFamily: font.medium,
        fontSize: 13,
        color: colors.inkFaint,
        textAlign: "center",
    },
});
