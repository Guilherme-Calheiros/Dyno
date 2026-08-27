import { useRouter } from "expo-router";
import { authClient } from "../../../lib/auth-client";
import Button from "./Button";
import { useToast } from "./Toast";

export default function SocialSignIn() {
    const toast = useToast();
    const router = useRouter();

    const handleGoogleSignIn = async () => {
        try {
            const result = await authClient.signIn.social({
                provider: "google",
                callbackURL: "/auth",
            });

            console.log("[SOCIAL] signIn.social result:", JSON.stringify(result, null, 2));

            if (result.error) {
                toast.error(result.error.message ?? "Erro ao entrar com Google");
                return;
            }

            const session = await authClient.getSession();
            console.log("[SOCIAL] session after:", JSON.stringify(session, null, 2));

            router.replace("/home");
        } catch (err) {
            console.error("[SOCIAL] error:", err);
            toast.error("Erro inesperado ao entrar com Google");
        }
    }

    return (
        <Button
            label="Entrar com Google"
            variant="secondary"
            icon="google"
            onPress={handleGoogleSignIn}
        />
    )
}
