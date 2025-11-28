import { IQueueConsumer } from "@application/contracts/IQueueConsumer";
import { MealsQueueGateway } from "@infra/gateways/MealsQueueGateway";
import { ProcessMealUseCase } from "@application/usecases/meals/ProcessMealUseCase";

export class MealsQueueConsumer implements IQueueConsumer<MealsQueueGateway.Message> {
    constructor(private readonly processMealUseCase: ProcessMealUseCase) { }

    async process({ accountId, mealId }: MealsQueueGateway.Message): Promise<void> {
        console.log("processing message: ", { accountId, mealId });
        await this.processMealUseCase.execute({ accountId, mealId });
        console.log("meal processed successfully: ", { accountId, mealId });
    }
}
