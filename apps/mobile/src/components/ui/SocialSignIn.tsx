import { useState } from "react";
import { useRouter } from "expo-router";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { authClient } from "../../../lib/auth-client";

type SocialSignInProps = {
    label?: string;
    errorMessage?: string;
};

export default function SocialSignIn({
    label = "Entrar com Google",
    errorMessage = "Erro ao entrar com Google",
}: SocialSignInProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const toast = useToast();

    async function handleGoogleSignIn() {
        setLoading(true);
        try {
            const { error } = await authClient.signIn.social({
                provider: "google",
                callbackURL: "/"
            });

            if (error) {
                toast.error(error.message ?? errorMessage);
                return;
            }

            router.replace("/");
        } catch (err) {
            toast.error(
                err instanceof Error ? err.message : "Erro desconhecido"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <Button
            label={label}
            variant="secondary"
            icon="google"
            disabled={loading}
            onPress={handleGoogleSignIn}
        />
    );
}