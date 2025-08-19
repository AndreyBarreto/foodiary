import { z } from "zod";

export const updateGoalSchema = z.object({
    goal: z.object({
        calories: z.number().min(1, "Calories is required"),
        protein: z.number().min(1, "Protein is required"),
        carbohydrates: z.number().min(1, "Carbohydrates is required"),
        fats: z.number().min(1, "Fats is required"),
    }),
});

export type UpdateGoalBody = z.infer<typeof updateGoalSchema>;

