import { Router } from "express";
import { db } from "../db";
import { agulhas } from "../db/schema/app";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

router.use(requireAuth);

router.get("/", async (req, res) => {
    try {
        const data = await db
            .select()
            .from(agulhas);

        return res.json({ agulhas: data });
    } catch (error) {
        console.error("Erro ao buscar agulhas:", error);

        return res.status(500).json({
            error: "Erro ao buscar agulhas",
        });
    }
})

export default router