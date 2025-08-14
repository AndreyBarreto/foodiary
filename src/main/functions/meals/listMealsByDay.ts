import "reflect-metadata";
import { Registry } from "@kernel/di/Registry";
import { lambdaHttpAdapter } from "@main/adapters/lambdaHttpAdapater";
import { ListMealsByDayController } from "@application/controllers/meals/ListMealsByDayController";

const controller = Registry.getInstance().resolve(ListMealsByDayController)

export const handler = lambdaHttpAdapter(controller);


