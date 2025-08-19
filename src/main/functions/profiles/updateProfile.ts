import "reflect-metadata";
import { Registry } from "@kernel/di/Registry";
import { lambdaHttpAdapter } from "@main/adapters/lambdaHttpAdapater";
import { UpdateProfileController } from "@application/controllers/profiles/UpdateProfileController";

const controller = Registry.getInstance().resolve(UpdateProfileController)

export const handler = lambdaHttpAdapter(controller);


