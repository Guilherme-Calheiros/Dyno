import { File } from "expo-file-system";
import { fetch as expoFetch } from "expo/fetch";
import { authedFetch } from "../../lib/authed-fetch";

export type UploadImageOptions<TConfirm> = {
    presignPath: string;
    confirmPath: string;
    uri: string;
    contentType: string;
    confirmBody?: Record<string, unknown>;
};

async function readError(response: Response, fallback: string) {
    const data = await response.json().catch(() => ({}));

    return data.error ?? fallback;
}

export async function uploadImage<TConfirm = unknown>({
    presignPath,
    confirmPath,
    uri,
    contentType,
    confirmBody,
}: UploadImageOptions<TConfirm>): Promise<{
    objectKey: string;
    publicUrl: string;
    confirm: TConfirm;
}> {
    const presignResponse = await authedFetch(presignPath, {
        method: "POST",
        body: JSON.stringify({ contentType }),
    });

    if (!presignResponse.ok) {
        throw new Error(
            await readError(presignResponse, "Erro ao preparar upload da foto")
        );
    }

    const { uploadUrl, objectKey, publicUrl } = (await presignResponse.json()) as {
        uploadUrl: string;
        objectKey: string;
        publicUrl: string;
    };

    const uploadResponse = await expoFetch(uploadUrl, {
        method: "PUT",
        body: new File(uri),
        headers: {
            "Content-Type": contentType,
        },
    });

    if (!uploadResponse.ok) {
        throw new Error("Erro ao enviar foto para o servidor");
    }

    const confirmResponse = await authedFetch(confirmPath, {
        method: "POST",
        body: JSON.stringify({ objectKey, ...confirmBody }),
    });

    if (!confirmResponse.ok) {
        throw new Error(
            await readError(confirmResponse, "Erro ao confirmar upload da foto")
        );
    }

    return {
        objectKey,
        publicUrl,
        confirm: (await confirmResponse.json()) as TConfirm,
    };
}