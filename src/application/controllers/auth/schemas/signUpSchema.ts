import { Profile } from "@application/entities/Profile";
import { z } from "zod";

export const signUpSchema = z.object({
    account: z.object({
        email: z.string().min(1, "Email is required").email("Invalid email"),
        password: z.string().min(8, "Password must be at least 8 characters long"),
    }),
    profile: z.object({
        name: z.string().min(1, "Name is required"),
        birthDate: z.string().min(1, "Birthdate is required").date("Invalid birthdate shoud be a valid date YYYY-MM-DD").transform((date) => new Date(date)),
        gender: z.nativeEnum(Profile.Gender),
        height: z.number().min(1, "Height is required"),
        weight: z.number().min(1, "Weight is required"),
        activityLevel: z.nativeEnum(Profile.ActivityLevel),
    }),
});

export type SignUpBody = z.infer<typeof signUpSchema>;

