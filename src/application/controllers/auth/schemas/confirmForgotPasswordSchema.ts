import { z } from "zod";

export const confirmForgotPasswordSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email"),
    code: z.string().min(1, "Code is required"),
    newPassword: z.string().min(1, "New password is required"),
});

export type ConfirmForgotPasswordBody = z.infer<typeof confirmForgotPasswordSchema>;


