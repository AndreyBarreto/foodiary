import { ZodSchema } from "zod";
import "reflect-metadata";

const SCHEMA_METADATA_KEY = "custom:schema";

export function Schema(schema: ZodSchema): ClassDecorator {
    return (target) => {
        Reflect.defineMetadata(SCHEMA_METADATA_KEY, schema, target);
    }
}

export function getSchema(target: object): ZodSchema | undefined {
    return Reflect.getMetadata(SCHEMA_METADATA_KEY, target.constructor);
}