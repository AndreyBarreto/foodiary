import { Profile } from "@application/entities/Profile";
import { z } from "zod";

export const updateProfileSchema = z.object({
    profile: z.object({
        name: z.string().min(1, "Name is required"),
        birthDate: z.string().min(1, "Birthdate is required").date("Invalid birthdate shoud be a valid date YYYY-MM-DD").transform((date) => new Date(date)),
        gender: z.nativeEnum(Profile.Gender),
        height: z.number().min(1, "Height is required"),
        weight: z.number().min(1, "Weight is required"),
    }),
});

export type UpdateProfileBody = z.infer<typeof updateProfileSchema>;

