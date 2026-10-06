import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { MAX_FOTOS_PRODUCAO, ProductionFoto } from "@artesaos/validation";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import ProductionPhotosCard from "@/components/productions/ProductionPhotosCard";
import AddPhotoSheet, { PhotoSource } from "@/components/productions/AddPhotoSheet";
import PhotoViewerModal from "@/components/productions/PhotoViewerModal";
import PhotoActionsSheet from "@/components/productions/PhotoActionsSheet";

const PICKER_BASE: ImagePicker.ImagePickerOptions = {
    mediaTypes: ["images"],
    quality: 0.7,
};

export type RemovePhotoResult = {
    capa: string | null;
    fotos: ProductionFoto[];
};

type ProductionPhotosSectionProps = {
    fotos: ProductionFoto[];
    loading: boolean;
    uploadPhoto: (uri: string, contentType: string) => Promise<void>;
    setCover: (fotoId: number) => Promise<void>;
    removePhoto: (fotoId: number) => Promise<RemovePhotoResult | undefined>;
};

export default function ProductionPhotosSection({
    fotos,
    loading,
    uploadPhoto,
    setCover,
    removePhoto,
}: ProductionPhotosSectionProps) {
    const toast = useToast();

    const [showAdd, setShowAdd] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [viewerIndex, setViewerIndex] = useState<number | null>(null);
    const [actionsIndex, setActionsIndex] = useState<number | null>(null);
    const [pendingDelete, setPendingDelete] = useState<number | null>(null);
    const [deleting, setDeleting] = useState(false);

    const atLimit = fotos.length >= MAX_FOTOS_PRODUCAO;

    const actionsFoto =
        actionsIndex === null ? null : fotos[actionsIndex] ?? null;
    const photoToDelete =
        pendingDelete === null ? null : fotos[pendingDelete] ?? null;

    const handleAdd = () => {
        if (atLimit) {
            toast.error(
                `Você pode ter no máximo ${MAX_FOTOS_PRODUCAO} fotos por produção`
            );
            return;
        }

        setShowAdd(true);
    };

    const handlePick = async (source: PhotoSource) => {
        setUploading(true);

        try {
            const result =
                source === "camera"
                    ? await ImagePicker.launchCameraAsync(PICKER_BASE)
                    : await ImagePicker.launchImageLibraryAsync({
                          ...PICKER_BASE,
                          allowsEditing: true,
                      });

            if (result.canceled) return;

            const asset = result.assets[0];

            await uploadPhoto(asset.uri, asset.mimeType ?? "image/jpeg");
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Erro ao adicionar foto"
            );
        } finally {
            setUploading(false);
        }
    };

    const handleSetCover = async () => {
        if (!actionsFoto) return;

        await setCover(actionsFoto.id);

        setActionsIndex(null);
    };

    const handleDelete = async () => {
        if (!photoToDelete) return;

        setDeleting(true);

        try {
            const result = await removePhoto(photoToDelete.id);

            setActionsIndex(null);

            if (result && result.fotos.length === 0) {
                setViewerIndex(null);
            } else if (result) {
                setViewerIndex((prev) =>
                    prev === null
                        ? null
                        : Math.min(prev, Math.max(result.fotos.length - 1, 0))
                );
            }
        } finally {
            setDeleting(false);
        }
    };

    return (
        <>
            <ProductionPhotosCard
                fotos={fotos}
                loading={loading || uploading}
                onAdd={handleAdd}
                onPressPhoto={setViewerIndex}
            />

            <ConfirmDialog
                visible={pendingDelete !== null}
                title="Excluir foto"
                message={
                    photoToDelete?.capa
                        ? "Esta é a capa da produção. A próxima foto será definida como capa automaticamente."
                        : "A foto será removida permanentemente desta produção."
                }
                icon="trash-alt"
                confirmLabel="Excluir"
                cancelLabel="Cancelar"
                destructive
                loading={deleting}
                onCancel={() => setPendingDelete(null)}
                onClose={() => setPendingDelete(null)}
                onConfirm={() => {
                    setPendingDelete(null);
                    handleDelete();
                }}
            />

            <AddPhotoSheet
                isOpen={showAdd}
                onClose={() => setShowAdd(false)}
                onPick={handlePick}
                loading={uploading}
            />

            <PhotoViewerModal
                visible={viewerIndex !== null}
                fotos={fotos}
                index={viewerIndex ?? 0}
                onIndexChange={setViewerIndex}
                onClose={() => {
                    setViewerIndex(null);
                    setActionsIndex(null);
                }}
                onMore={() => {
                    if (viewerIndex === null) return;

                    setActionsIndex(viewerIndex);
                }}
            />

            <PhotoActionsSheet
                isOpen={actionsFoto !== null}
                isCover={actionsFoto?.capa ?? false}
                onClose={() => setActionsIndex(null)}
                onSetCover={handleSetCover}
                onDelete={() => setPendingDelete(actionsIndex)}
            />
        </>
    );
}