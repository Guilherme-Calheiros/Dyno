import { Router } from "express";
import { randomUUID } from "node:crypto";
import { fromNodeHeaders } from "better-auth/node";
import { auth } from "../auth/index.js";
import { createUploadUrl, deleteObject, getObjectKeyFromUrl, getPublicUrl } from "../storage/r2.js";
import { db } from "../db/index.js";
import { user } from "../db/schema/auth.js";
import { eq } from "drizzle-orm";

const router = Router();

const allowedContentTypes = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
} as const;

router.post("/avatar/presign", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  })

  if (!session?.user){
    return res.status(401).json({ error: "Não autorizado" });
  }

  const contentType = req.body.contentType;

  if (typeof contentType !== "string" || !(contentType in allowedContentTypes)) {
    return res.status(400).json({ error: "Tipo de imagem não permitido" });
  }

  const ext = allowedContentTypes[contentType as keyof typeof allowedContentTypes]
  const objectKey = `avatars/${session.user.id}/${randomUUID()}.${ext}`;

  try {
    const uploadUrl = await createUploadUrl(objectKey, contentType);
    return res.json({
      uploadUrl,
      objectKey,
      publicUrl: getPublicUrl(objectKey),
    })
  } catch (err) {
    console.error("[avatar-presign] falha ao gerar URL de upload", err);
    return res.status(500).json({ error: "Erro ao gerar URL de upload" });
  }
})

router.post("/avatar/confirm", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  })

  if (!session?.user){
    return res.status(401).json({ error: "Não autorizado" });
  }

  const { objectKey } = req.body;
  if (typeof objectKey !== "string" || !objectKey.startsWith(`avatars/${session.user.id}/`)) {
    return res.status(400).json({ error: "Chave de objeto inválida" });
  }

  try {
    const newImageUrl = getPublicUrl(objectKey);
    const oldImageUrl = session.user.image;

    await db
      .update(user)
      .set({ image: newImageUrl, updatedAt: new Date() })
      .where(eq(user.id, session.user.id));

    if (oldImageUrl) {
      const oldObjectKey = getObjectKeyFromUrl(oldImageUrl);
      if (oldObjectKey && oldObjectKey !== objectKey) {
        await deleteObject(oldObjectKey);
      }
    }

    return res.json({ publicUrl: newImageUrl });
  } catch (err) {
    console.error("[avatar-confirm] falha ao confirmar upload", err);
    return res.status(500).json({ error: "Erro ao confirmar upload" });
  }
})

router.post("/avatar/remove", async (req, res) => {
  const session = await auth.api.getSession({
    headers: fromNodeHeaders(req.headers),
  })

  if (!session?.user){
    return res.status(401).json({ error: "Não autorizado" });
  }

  const currentImageUrl = session.user.image;

  if (!currentImageUrl) {
    return res.status(200).json({ success: true });
  }

  try {
    const objectKey = getObjectKeyFromUrl(currentImageUrl);
    if (objectKey && objectKey.startsWith(`avatars/${session.user.id}/`)) {
      await deleteObject(objectKey);
    }

    await db
      .update(user)
      .set({ image: null, updatedAt: new Date() })
      .where(eq(user.id, session.user.id));

    return res.json({ success: true });
  } catch (error) {
    console.error("[avatar-remove] falha ao remover avatar", error);
    return res.status(500).json({ error: "Erro ao remover avatar" });
  }
})

export default router;