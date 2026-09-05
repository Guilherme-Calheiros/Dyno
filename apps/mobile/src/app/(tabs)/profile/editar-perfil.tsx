import { useMemo, useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { File } from "expo-file-system";
import { fetch as expoFetch } from "expo/fetch";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import AvatarPicker from "@/components/profile/AvatarPicker";
import { useToast } from "@/components/ui/Toast";
import { authClient } from "../../../../lib/auth-client";
import { profileSchema } from "@/lib/validations";
import { colors, font } from "@/theme/tokens";
import { API_URL, authedFetch } from "@/config/api";

type UpdatePayload = {
    name?: string;
    bio?: string;
};

export default function EditarPerfil() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const toast = useToast();

    const { data: session, refetch } = authClient.useSession();
    const user = session?.user;

    const [initial] = useState({
        name: user?.name ?? "",
        bio: user?.bio ?? "",
        image: user?.image ?? null,
    });

    const [nome, setNome] = useState(initial.name);
    const [bio, setBio] = useState(initial.bio);

    const [fotoSelecionada, setFotoSelecionada] = useState<{
        uri: string;
        contentType: string;
    } | null>(null);

    const [removerFoto, setRemoverFoto] = useState(false);

    const [loading, setLoading] = useState(false);

    const changed = useMemo(() => {
        const diffs: UpdatePayload = {};

        if (nome !== initial.name) {
            diffs.name = nome;
        }

        if (bio !== initial.bio) {
            diffs.bio = bio;
        }

        return diffs;
    }, [nome, bio, initial]);

    const hasProfileChanges = Object.keys(changed).length > 0;

    const hasImageChange = fotoSelecionada !== null || removerFoto;

    const hasChanges = hasProfileChanges || hasImageChange;

    const email = user?.email ?? "";

    function onFotoChanged(foto: { uri: string; contentType: string }) {
        setFotoSelecionada(foto);
        setRemoverFoto(false);
    }

    function onFotoRemovida() {
        setFotoSelecionada(null);
        setRemoverFoto(true);
    }

    async function uploadAvatar(foto: { uri: string; contentType: string }) {
        console.log("CONTENT TYPE:", foto.contentType);
        const presignResponse = await authedFetch("/api/storage/avatar/presign", {
            method: "POST",
            body: JSON.stringify({
                contentType: foto.contentType,
            }),
        });

        if (!presignResponse.ok) {
            const data = await presignResponse.json().catch(() => ({}));
            console.log("PRESIGN STATUS:", presignResponse.status);
            console.log("PRESIGN RESPONSE:", data);
            throw new Error(data.error ?? "Erro ao preparar upload da foto");
        }

        const { uploadUrl, objectKey } = (await presignResponse.json()) as {
            uploadUrl: string;
            objectKey: string;
        };

        const file = new File(foto.uri);

        const uploadResponse = await expoFetch(uploadUrl, {
            method: "PUT",
            body: file,
            headers: {
                "Content-Type": foto.contentType,
            },
        })

        if (!uploadResponse.ok) {
            throw new Error("Erro ao enviar foto para o servidor");
        }

        const confirmResponse = await authedFetch("/api/storage/avatar/confirm", {
            method: "POST",
            body: JSON.stringify({
                objectKey,
            }),
        });

        if (!confirmResponse.ok) {
            const data = await confirmResponse.json().catch(() => ({}));
            throw new Error(data.error ?? "Erro ao confirmar upload da foto");
        }
    }

    async function removeAvatar() {
        const response = await authedFetch("/api/storage/avatar/remove", {
                method: "POST",
            }
        );

        if (!response.ok) {
            const data = await response.json().catch(() => ({}));

            throw new Error(
                data.error ?? "Erro ao remover foto"
            );
        }
    }

    async function salvar() {
        const parsed = profileSchema.safeParse({
            name: nome,
            bio,
        });

        if (!parsed.success) {
            const msg = parsed.error.issues[0]?.message ?? "Dados do perfil inválidos";
            toast.error(msg);
            return;
        }

        if (!hasChanges) {
            toast.error("Nada para salvar");
            return;
        }

        setLoading(true);

        try {
            if (hasProfileChanges) {
                const cookies = await authClient.getCookie();

                const response = await fetch(`${API_URL}/api/profile`, {
                        method: "PATCH",
                        headers: {
                            Cookie: cookies,
                            "Content-Type": "application/json",
                        },
                        credentials: "omit",
                        body: JSON.stringify({
                            name: nome,
                            bio,
                        }),
                    }
                );

                if (!response.ok) {
                    const data = await response
                        .json()
                        .catch(() => ({}));

                    throw new Error(data.error ?? "Erro ao salvar informações do perfil");
                }
            }

            if (fotoSelecionada) {
                await uploadAvatar(fotoSelecionada);
            }

            if (removerFoto) {
                await removeAvatar();
            }

            await refetch();

            toast.success("Alterações salvas");
            router.back();
        } catch (err) {
            toast.error(err instanceof Error ? err.message : "Erro ao salvar alterações");
        } finally {
            setLoading(false);
        }
    }

    const previewImage = removerFoto ? null : fotoSelecionada?.uri ?? user?.image ?? null;

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={
                Platform.OS === "ios"
                    ? "padding"
                    : "height"
            }
        >
            <ScrollView
                contentContainerStyle={{
                    flexGrow: 1,
                }}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View
                    style={[
                        styles.container,
                        {
                            paddingTop:
                                insets.top + 8,
                        },
                    ]}
                >
                    <View style={styles.header}>
                        <Pressable
                            style={styles.backBtn}
                            onPress={() => router.back()}
                        >
                            <FontAwesome5
                                name="arrow-left"
                                size={18}
                                color={colors.ink}
                            />
                        </Pressable>

                        <Text style={styles.headerTitle}>
                            Editar perfil
                        </Text>
                    </View>

                    <AvatarPicker
                        image={previewImage}
                        name={nome || user?.name || ""}
                        onChanged={onFotoChanged}
                        onRemove={onFotoRemovida}
                        disabled={loading}
                    />

                    {fotoSelecionada ? (
                        <Text style={styles.fotoHint}>
                            Foto alterada
                        </Text>
                    ) : null}

                    {removerFoto ? (
                        <Text style={styles.fotoHint}>
                            Foto será removida ao salvar
                        </Text>
                    ) : null}

                    <Text style={styles.sectionTitle}>
                        Informações da conta
                    </Text>

                    <View style={styles.formCard}>
                        <Input
                            label="Nome"
                            value={nome}
                            onChangeText={setNome}
                            placeholder="Seu nome"
                        />

                        <Input
                            label="Biografia"
                            value={bio}
                            onChangeText={setBio}
                            placeholder="Conte um pouco sobre você"
                            multiline
                            numberOfLines={4}
                            textAlignVertical="top"
                        />

                        <Input
                            label="E-mail"
                            value={email}
                            editable={false}
                        />
                    </View>

                    <Button
                        label="Salvar alterações"
                        onPress={salvar}
                        disabled={loading}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingBottom: 24,
        gap: 20,
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
    },

    backBtn: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
    },

    headerTitle: {
        fontFamily: font.semiBold,
        fontSize: 20,
        color: colors.ink,
    },

    sectionTitle: {
        fontFamily: font.semiBold,
        fontSize: 16,
        color: colors.ink,
    },

    formCard: {
        gap: 16,
    },

    fotoHint: {
        textAlign: "center",
        fontFamily: font.semiBold,
        fontSize: 13,
        color: colors.primary,
    },
});