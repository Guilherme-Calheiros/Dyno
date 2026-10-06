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
import ProductionSummaryCard from "@/components/productions/ProductionSummaryCard";
import ProductionPhotosSection from "@/components/productions/ProductionPhotosSection";
import { useToast } from "@/components/ui/Toast";
import { authedFetch } from "../../../lib/authed-fetch";
import { useProduction } from "@/hooks/useProduction";
import { useLocalSearchParams, useRouter } from "expo-router";
import MaterialSheet, { EditingMaterial } from "@/components/material/MaterialSheet";
import ProductionMaterialsCard from "@/components/productions/ProductionMaterialsCard";
import ProductionTimer from "@/components/productions/ProductionTimer";
import Button from "@/components/ui/Button";
import { ProductionFoto, ProductionStatus } from "@artesaos/validation";

const EMPTY_FOTOS: ProductionFoto[] = [];

export default function ProductionDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const toast = useToast();
    const insets = useSafeAreaInsets();

    const {
        production,
        loading,
        rename,
        saveDescription,
        saveValues,
        addMaterial,
        removeMaterial,
        editMaterial,
        pauseTimer,
        resetTimer,
        setStatus,
        uploadPhoto,
        setCover,
        removePhoto,
    } = useProduction(id);

    const [showActions, setShowActions] = useState(false);
    const [showValues, setShowValues] = useState(false);
    const [showMaterials, setShowMaterials] = useState(false);
    const [confirmVisible, setConfirmVisible] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [pendingStatus, setPendingStatus] = useState<ProductionStatus | null>(null);
    const [changingStatus, setChangingStatus] = useState(false);
    const [editingMaterial, setEditingMaterial] = useState<EditingMaterial | null>(null);

    const isConcluida = production?.status === "concluido";
    const fotos = production?.fotos ?? EMPTY_FOTOS;

    const handleChangeStatus = async (status: ProductionStatus) => {
        setChangingStatus(true);
        try {
            await setStatus(status);
        } finally {
            setChangingStatus(false);
        }
    }

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
                    contentContainerStyle={[
                        styles.scrollContent,
                        { paddingBottom: insets.bottom + 24 },
                    ]}
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

                        <ProductionTimer
                            tempoReal={production?.tempoReal ?? 0}
                            locked={isConcluida}
                            onPause={pauseTimer}
                            onReset={resetTimer}
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

                        <ProductionPhotosSection
                            fotos={fotos}
                            loading={loading}
                            uploadPhoto={uploadPhoto}
                            setCover={setCover}
                            removePhoto={removePhoto}
                        />

                        {!isConcluida && (
                            <Button
                                label="Finalizar produção"
                                variant="primary"
                                icon="check"
                                disabled={loading || changingStatus}
                                onPress={() => setPendingStatus("concluido")}
                            />
                        )}
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
                onReabrir={
                    isConcluida
                        ? () => setPendingStatus("andamento")
                        : undefined
                }
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

            <ConfirmDialog
                visible={pendingStatus !== null}
                title={
                    pendingStatus === "concluido"
                        ? "Finalizar produção"
                        : "Voltar para em andamento"
                }
                message={
                    pendingStatus === "concluido"
                        ? "A produção será marcada como concluída e movida para a aba Concluídas. Você pode voltar para em andamento depois."
                        : "A produção voltará para a aba Em andamento e o cronômetro poderá ser usado novamente."
                }
                icon={pendingStatus === "concluido" ? "check" : "undo"}
                confirmLabel={
                    pendingStatus === "concluido" ? "Finalizar" : "Voltar"
                }
                cancelLabel="Cancelar"
                loading={changingStatus}
                onCancel={() => setPendingStatus(null)}
                onClose={() => setPendingStatus(null)}
                onConfirm={async () => {
                    const target = pendingStatus;

                    if (!target) return;

                    try {
                        await handleChangeStatus(target);
                    } finally {
                        setPendingStatus(null);
                    }
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
    },
    body: {
        paddingHorizontal: 20,
        paddingTop: 18,
        gap: 14,
    },
});