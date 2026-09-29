import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors } from "@/theme/tokens";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import ProductionActionsSheet from "@/components/productions/ProductionActionsSheet";
import ProductionValuesSheet from "@/components/productions/ProductionValuesSheet";
import DetailHero from "@/components/ui/DetailHero";
import ProductionHeader from "@/components/productions/ProductionHeader";
import ProductionDescriptionCard from "@/components/productions/ProductionDescriptionCard";
import ProductionStatusCard from "@/components/productions/ProductionStatusCard";
import ProductionSummaryCard from "@/components/productions/ProductionSummaryCard";
import { useToast } from "@/components/ui/Toast";
import { authedFetch } from "../../../../lib/authed-fetch";
import { useProduction } from "@/hooks/useProduction";
import { useLocalSearchParams, useRouter } from "expo-router";
import MaterialSheet, { EditingMaterial } from "@/components/material/MaterialSheet";
import ProductionMaterialsCard from "@/components/productions/ProductionMaterialsCard";

export default function ProductionDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const toast = useToast();
    const insets = useSafeAreaInsets();

    const { production, loading, rename, saveDescription, saveValues, addMaterial, removeMaterial, editMaterial } =
        useProduction(id);

    const [showActions, setShowActions] = useState(false);
    const [showValues, setShowValues] = useState(false);
    const [showMaterials, setShowMaterials] = useState(false);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [editingMaterial, setEditingMaterial] = useState<EditingMaterial | null>(null)

    const handleDelete = async () => {
        setDeleting(true);
        try {
            const response = await authedFetch(`/api/productions/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Erro ao excluir produção");
            }

            toast.success("Produção excluída");
            router.back();
        } catch (error) {
            toast.error(error instanceof Error ? error.message : "Erro ao excluir produção");
        } finally {
            setDeleting(false);
        }
    };

    return (
        <View style={styles.container}>
            <KeyboardAvoidingView
                style={styles.keyboardArea}
                behavior={Platform.OS === "ios" ? "padding" : "height"}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={false}
                >
                    <DetailHero
                        cover={production?.capa ?? null}
                        topInset={insets.top}
                        onBack={() => router.back()}
                        onMore={() => setShowActions(true)}
                    />

                    <View style={styles.body}>
                        <ProductionHeader
                            production={production}
                            loading={loading}
                            onRename={rename}
                        />

                        <ProductionDescriptionCard
                            production={production}
                            loading={loading}
                            onSave={saveDescription}
                        />

                        <ProductionStatusCard
                            production={production}
                            loading={loading}
                        />

                        <ProductionMaterialsCard
                            production={production}
                            loading={loading}
                            onAdd={() => setShowMaterials(true)}
                            onEdit={(material) => {
                                setEditingMaterial(material);
                                setShowMaterials(true);
                            }}
                            onDelete={removeMaterial}
                        />

                        <ProductionSummaryCard
                            production={production}
                            loading={loading}
                            onEdit={() => setShowValues(true)}
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            <MaterialSheet 
                isOpen={showMaterials}
                onClose={() => {
                    setShowMaterials(false);
                    setEditingMaterial(null);
                }}
                material={editingMaterial}
                onAdd={addMaterial}
                onEdit={editMaterial}
            />

            <ProductionActionsSheet
                isOpen={showActions}
                onClose={() => setShowActions(false)}
                onDelete={() => setConfirmVisible(true)}
            />

            <ProductionValuesSheet
                isOpen={showValues}
                onClose={() => setShowValues(false)}
                production={production}
                onSave={saveValues}
            />

            <ConfirmDialog
                visible={confirmVisible}
                title="Excluir produção"
                message="Esta ação não pode ser desfeita. A produção e todos os seus dados serão removidos permanentemente. Deseja continuar?"
                icon="exclamation-triangle"
                confirmLabel="Excluir"
                cancelLabel="Cancelar"
                destructive
                loading={deleting}
                onCancel={() => setConfirmVisible(false)}
                onClose={() => setConfirmVisible(false)}
                onConfirm={() => {
                    setConfirmVisible(false);
                    handleDelete();
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bg,
    },
    keyboardArea: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 24,
    },
    body: {
        paddingHorizontal: 20,
        paddingTop: 18,
        gap: 14,
    },
});