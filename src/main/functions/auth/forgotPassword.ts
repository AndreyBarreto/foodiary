import "reflect-metadata";
import { Registry } from "@kernel/di/Registry";
import { ForgotPasswordController } from "@application/controllers/auth/ForgotPasswordController";
import { lambdaHttpAdapter } from "@main/adapters/lambdaHttpAdapater";

const controller = Registry.getInstance().resolve(ForgotPasswordController)

export const handler = lambdaHttpAdapter(controller);


