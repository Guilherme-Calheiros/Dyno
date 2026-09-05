import { z } from "zod";

export const loginSchema = z.object({
    email: z
        .email()
        .min(1, "E-mail é obrigatório"),
    password: z
        .string()
        .min(1, "Senha é obrigatória")
        .min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const signupSchema = z
    .object({
        name: z
            .string()
            .min(1, "Nome é obrigatório")
            .min(2, "Nome deve ter no mínimo 2 caracteres"),
        email: z
            .email()
            .min(1, "E-mail é obrigatório"),
        password: z
            .string()
            .min(1, "Senha é obrigatória")
            .min(6, "Senha deve ter no mínimo 6 caracteres"),
        confirmPassword: z
            .string()
            .min(1, "Confirmação de senha é obrigatória"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "As senhas não coincidem",
        path: ["confirmPassword"],
    });

export type SignupFormData = z.infer<typeof signupSchema>;

export const forgotPasswordSchema = z.object({
    email: z
        .email()
        .min(1, "E-mail é obrigatório"),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z
    .object({
        password: z
            .string()
            .min(1, "Senha é obrigatória")
            .min(6, "Senha deve ter no mínimo 6 caracteres"),
        confirmPassword: z
            .string()
            .min(1, "Confirmação de senha é obrigatória"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "As senhas não coincidem",
        path: ["confirmPassword"],
    });

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

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

export const changePasswordSchema = z
    .object({
        currentPassword: z
            .string()
            .min(1, "Senha atual é obrigatória"),
        newPassword: z
            .string()
            .min(1, "Nova senha é obrigatória")
            .min(6, "A nova senha deve ter no mínimo 6 caracteres"),
        confirmPassword: z
            .string()
            .min(1, "Confirmação é obrigatória"),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
        message: "As senhas não coincidem",
        path: ["confirmPassword"],
    });

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
