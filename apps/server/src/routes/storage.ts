import { Router } from "express";
import { randomUUID } from "node:crypto";
import { createUploadUrl, deleteObject, getObjectKeyFromUrl, getPublicUrl } from "../storage/r2.js";
import { resolveImageExtension } from "../storage/imageTypes.js";
import { db } from "../db/index.js";
import { user } from "../db/schema/auth.js";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

router.use(requireAuth);

router.post("/avatar/presign", async (req, res) => {
  const ext = resolveImageExtension(req.body.contentType);

  if (!ext) {
    return res.status(400).json({ error: "Tipo de imagem não permitido" });
  }

  const contentType = req.body.contentType as string;
  const objectKey = `avatars/${res.locals.user.id}/${randomUUID()}.${ext}`;

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
  const { objectKey } = req.body;
  if (typeof objectKey !== "string" || !objectKey.startsWith(`avatars/${res.locals.user.id}/`)) {
    return res.status(400).json({ error: "Chave de objeto inválida" });
  }

  try {
    const newImageUrl = getPublicUrl(objectKey);
    const oldImageUrl = res.locals.user.image;

    await db
      .update(user)
      .set({ image: newImageUrl, updatedAt: new Date() })
      .where(eq(user.id, res.locals.user.id));

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
  const currentImageUrl = res.locals.user.image;

  if (!currentImageUrl) {
    return res.status(200).json({ success: true });
  }

  try {
    const objectKey = getObjectKeyFromUrl(currentImageUrl);
    if (objectKey && objectKey.startsWith(`avatars/${res.locals.user.id}/`)) {
      await deleteObject(objectKey);
    }

    await db
      .update(user)
      .set({ image: null, updatedAt: new Date() })
      .where(eq(user.id, res.locals.user.id));

    return res.json({ success: true });
  } catch (error) {
    console.error("[avatar-remove] falha ao remover avatar", error);
    return res.status(500).json({ error: "Erro ao remover avatar" });
  }
})

export default router;