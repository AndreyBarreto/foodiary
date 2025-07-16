import "reflect-metadata";
import { SignInController } from "@application/controllers/auth/SingInController";
import { Registry } from "@kernel/di/Registry";
import { lambdaHttpAdapter } from "@main/adapters/lambdaHttpAdapater";

const controller = Registry.getInstance().resolve(SignInController)

export const handler = lambdaHttpAdapter(controller);


