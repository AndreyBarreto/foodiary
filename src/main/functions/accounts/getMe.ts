import "reflect-metadata";
import { Registry } from "@kernel/di/Registry";
import { lambdaHttpAdapter } from "@main/adapters/lambdaHttpAdapater";
import { GetMeController } from "@application/controllers/accounts/GetMeController";

const controller = Registry.getInstance().resolve(GetMeController)

export const handler = lambdaHttpAdapter(controller);


