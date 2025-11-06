import "reflect-metadata";
import { lambdaS3Adapter } from "@main/adapters/lambdaS3Adapter";
import { Registry } from "@kernel/di/Registry";
import { MealUploadedFileEventHandler } from "@application/events/files/MealUploadedFileEventHandler";

const eventHandler = Registry.getInstance().resolve(MealUploadedFileEventHandler)

export const handler = lambdaS3Adapter(eventHandler)
