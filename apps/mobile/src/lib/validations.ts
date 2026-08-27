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
