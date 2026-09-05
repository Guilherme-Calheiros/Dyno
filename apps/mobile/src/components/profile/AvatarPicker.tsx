import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Button from "@/components/ui/Button";
import { useToast } from "@/components/ui/Toast";
import { colors, font } from "@/theme/tokens";

type AvatarPickerProps = {
    image?: string | null;
    name: string;
    onChanged: (image: {
        uri: string;
        contentType: string;
    }) => void;
    onRemove: () => void;
    disabled?: boolean;
};

export default function AvatarPicker({
    image,
    name,
    onChanged,
    onRemove,
    disabled = false,
}: AvatarPickerProps) {
    const toast = useToast();

    const initial = (name.trim() || "A").charAt(0).toUpperCase();

    async function pickImage() {
        const permission =
            await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (!permission.granted) {
            toast.error(
                "Precisamos de acesso às suas fotos para escolher uma imagem."
            );
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.7,
        });

        if (result.canceled) return;

        const asset = result.assets[0];
        onChanged({
            uri: asset.uri,
            contentType: asset.mimeType ?? "image/jpeg",
        });
    }

    return (
        <View style={styles.section}>
            <Pressable
                onPress={pickImage}
                disabled={disabled}
                style={styles.avatarWrap}
                accessibilityRole="button"
            >
                {image ? (
                    <Image
                        source={{ uri: image }}
                        style={styles.avatarImage}
                    />
                ) : (
                    <Text style={styles.avatarLetter}>
                        {initial}
                    </Text>
                )}

                <View style={styles.cameraBadge}>
                    <FontAwesome5
                        name="camera"
                        size={15}
                        color="#ffffff"
                    />
                </View>
            </Pressable>

            <Text style={styles.changePhoto}>
                Alterar foto
            </Text>

            {image ? (
                <Button
                    label="Remover foto"
                    variant="secondary"
                    onPress={onRemove}
                    disabled={disabled}
                />
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        alignItems: "center",
        gap: 10,
    },

    avatarWrap: {
        width: 92,
        height: 92,
        borderRadius: 999,
        backgroundColor: colors.tint,
        alignItems: "center",
        justifyContent: "center",
    },

    avatarImage: {
        width: 92,
        height: 92,
        borderRadius: 999,
    },

    avatarLetter: {
        fontFamily: font.semiBold,
        fontSize: 36,
        color: colors.primaryDeep,
    },

    cameraBadge: {
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 999,
        backgroundColor: colors.primary,
        borderWidth: 3,
        borderColor: "#faf7fb",
        alignItems: "center",
        justifyContent: "center",
    },

    changePhoto: {
        fontFamily: font.semiBold,
        fontSize: 13,
        color: colors.primary,
    },
});