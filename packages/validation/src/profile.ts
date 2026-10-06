import { z } from "zod";

export const profileSchema = z.object({
    name: z
        .string()
        .trim()
        .min(1, "Nome é obrigatório")
        .max(100, "Nome deve ter no máximo 100 caracteres"),

    bio: z
        .string()
        .trim()
        .max(500, "Bio deve ter no máximo 500 caracteres"),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
