import { z } from "zod";

export const listMealsByDaySchema = z.object({
    date: z.string()
        .min(1, "Date is required")
        .date("Date should be a valid date (yyyy-mm-dd)")
        .transform(date => new Date(date)),
});


