import { z } from "zod";

export const schema = z.object({
    COGNITO_CLIENT_ID: z.string(),
    COGNITO_CLIENT_SECRET: z.string(),
    MAIN_TABLE_NAME: z.string(),
    COGNITO_POOL_ID: z.string(),
});


export type Env = z.infer<typeof schema>;

function getEnv() {
    try {
        return schema.parse(process.env);
    } catch {
        throw new Error(`Invalid environment variables`);
    }
}

export const env = getEnv();
