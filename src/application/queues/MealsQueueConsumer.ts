import { IQueueConsumer } from "@application/contracts/IQueueConsumer";
import { AppConfig } from "@shared/config/appconfig";
import { MealsQueueGateway } from "@infra/gateways/MealsQueueGateway";

export class MealsQueueConsumer implements IQueueConsumer<MealsQueueGateway.Message> {
    constructor(private readonly appConfig: AppConfig) { }

    async process({ accountId, mealId }: MealsQueueGateway.Message): Promise<void> {
        console.log("processing message: ", { accountId, mealId });
    }
}
