import { Injectable } from "@kernel/decorators/Injectable";
import { Meal } from "@application/entities/Meal";
import { MealsFileStorageGateway } from "@infra/gateways/MealsFileStorageGateway";
import { MealRepository } from "@infra/database/dynamo/repositories/MealRepository";
import { ResourceNotFound } from "@application/errors/application/ResourceNotFound";


const MAX_ATTEMPTS = 3;

@Injectable()
export class ProcessMealUseCase {

    constructor(
        private readonly mealRepository: MealRepository,
        private readonly mealsFileStorageGateway: MealsFileStorageGateway) { }

    async execute({ accountId, mealId }: ProcessMealUseCase.Input): Promise<ProcessMealUseCase.Output> {
        const meal = await this.mealRepository.findById({ accountId, mealId });

        if (!meal) throw new ResourceNotFound(`Meal ${mealId} not found`);

        if (meal.status === Meal.Status.UPLOADING) {
            throw new Error(`Meal ${mealId} is still uploading`);
        }
        if (meal.status === Meal.Status.PROCESSING) {
            throw new Error(`Meal ${mealId} is already being processed`);
        }

        if (meal.status === Meal.Status.FAILED || meal.status === Meal.Status.SUCCESS) {
            return;
        }


        try {
            meal.status = Meal.Status.PROCESSING;
            meal.attempts += 1;
            await this.mealRepository.save(meal);
            // USAR aI
            meal.status = Meal.Status.SUCCESS;
            await this.mealRepository.save(meal);
        } catch (error) {
            console.error(`Error processing meal ${mealId}: in attempt ${meal.attempts}`, error);
            meal.status = meal.attempts >= MAX_ATTEMPTS ? Meal.Status.FAILED : Meal.Status.QUEUED;
            await this.mealRepository.save(meal);
            throw error;
        }
    }
}

export namespace ProcessMealUseCase {
    export type Input = {
        accountId: string;
        mealId: string;
    }
    export type Output = void;
}
