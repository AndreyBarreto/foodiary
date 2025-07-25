import "reflect-metadata";
import { Registry } from "@kernel/di/Registry";
import { lambdaHttpAdapter } from "@main/adapters/lambdaHttpAdapater";
import { RefreshTokenController } from "@application/controllers/auth/RefreshTokenController";

const controller = Registry.getInstance().resolve(RefreshTokenController)

export const handler = lambdaHttpAdapter(controller);


