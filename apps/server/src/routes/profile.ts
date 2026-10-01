import { Router } from "express";
import { profileSchema } from "../../../mobile/src/lib/validations";
import { db } from "../db";
import { user } from "../db/schema/auth";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

router.use(requireAuth);

router.patch("/", async (req, res) => {
    const result = profileSchema.safeParse(req.body);

    if (!result.success) {
        const msg = result.error.issues[0]?.message ?? "Dados do perfil inválidos";
        return res.status(400).json({ error: msg });
    }

    const { name, bio } = result.data;

    try {
        const [updatedUser] = await db
            .update(user)
            .set({ name, bio, updatedAt: new Date() })
            .where(eq(user.id, res.locals.user.id))
            .returning();
        return res.json({ user: updatedUser });
    } catch (error) {
        console.error("[profile-update] falha ao atualizar o perfil", error);
        return res.status(500).json({ error: "Erro ao atualizar o perfil" });
    }
})

export default router;