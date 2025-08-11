import { z } from "zod";
import { mbToBytes } from "@shared/utils/mbToBytes";

export const createMealSchema = z.object({
    file: z.object({
        type: z.enum(["audio/m4a", "image/jpeg"]),
        size: z.number()
            .min(1, "File size must be greater than 0")
            .max(mbToBytes(10), "File size must be less than 10MB"),
    }),
});

export type CreateMealBody = z.infer<typeof createMealSchema>;


