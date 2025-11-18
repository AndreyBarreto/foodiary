import { Injectable } from "@kernel/decorators/Injectable";
import { Meal } from "@application/entities/Meal";
import { MealsFileStorageGateway } from "@infra/gateways/MealsFileStorageGateway";
import { MealRepository } from "@infra/database/dynamo/repositories/MealRepository";
import { ResourceNotFound } from "@application/errors/application/ResourceNotFound";
import { MealsQueueGateway } from "@infra/gateways/MealsQueueGateway";


@Injectable()
export class MealUploadedUseCase {

    constructor(
        private readonly mealRepository: MealRepository,
        private readonly mealsFileStorageGateway: MealsFileStorageGateway,
        private readonly mealsQueueGateway: MealsQueueGateway) { }

    async execute({ fileKey }: MealUploadedUseCase.Input): Promise<MealUploadedUseCase.Output> {
        console.log("executing meal uploaded use case");

        const { accountId, mealId } = await this.mealsFileStorageGateway.getFileMetadata({ fileKey });

        const meal = await this.mealRepository.findById({ accountId, mealId });

        if (!meal) {
            throw new ResourceNotFound("Meal not found");
        }

        meal.status = Meal.Status.QUEUED;
        await this.mealRepository.save(meal);

        await this.mealsQueueGateway.publishMessage({
            accountId,
            mealId,
        });

        console.log("meal uploaded use case executed successfully");
    }
}
export namespace MealUploadedUseCase {
    export type Input = {
        fileKey: string;
    }
    export type Output = void;
}
