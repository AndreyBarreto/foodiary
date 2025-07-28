import "reflect-metadata";
import { Registry } from "@kernel/di/Registry";
import { ConfirmForgotPasswordController } from "@application/controllers/auth/ConfirmForgotPasswordController";
import { lambdaHttpAdapter } from "@main/adapters/lambdaHttpAdapater";

const controller = Registry.getInstance().resolve(ConfirmForgotPasswordController)

export const handler = lambdaHttpAdapter(controller);


