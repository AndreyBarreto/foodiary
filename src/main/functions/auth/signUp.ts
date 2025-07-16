import "reflect-metadata";
import { SignUpController } from "@application/controllers/SingUpController";
import { Registry } from "@kernel/di/Registry";
import { lambdaHttpAdapter } from "@main/adapters/lambdaHttpAdapater";

const controller = Registry.getInstance().resolve(SignUpController)

export const handler = lambdaHttpAdapter(controller);


