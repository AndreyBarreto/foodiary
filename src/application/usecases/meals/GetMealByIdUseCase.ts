import { Injectable } from "@kernel/decorators/Injectable";
import { Meal } from "@application/entities/Meal";
import { MealsFileStorageGateway } from "@infra/gateways/MealsFileStorageGateway";
import { MealRepository } from "@infra/database/dynamo/repositories/MealRepository";
import { ResourceNotFound } from "@application/errors/application/ResourceNotFound";


@Injectable()
export class GetMealByIdUseCase {

    constructor(
        private readonly mealRepository: MealRepository,
        private readonly mealsFileStorageGateway: MealsFileStorageGateway) { }

    async execute({ accountId, mealId }: GetMealByIdUseCase.Input): Promise<GetMealByIdUseCase.Output> {
        const meal = await this.mealRepository.findById({ accountId, mealId });
        if (!meal) throw new ResourceNotFound("Meal not found");
        const inputFileURL = this.mealsFileStorageGateway.getInputFileURL(meal.inputFileKey);

        return {
            meal: {
                id: meal.id,
                status: meal.status,
                inputType: meal.inputType,
                inputFileURL,
                name: meal.name ?? "",
                icon: meal.icon ?? "",
                foods: meal.foods ?? [],
                createdAt: meal.createdAt.toISOString(),
            },
        };
    }
}

export namespace GetMealByIdUseCase {
    export type Input = {
        accountId: string;
        mealId: string;
    }
    export type Output = {
        meal: {
            id: string;
            status: Meal.Status;
            inputType: Meal.InputType;
            inputFileURL: string;
            name: string;
            icon: string;
            foods: Meal.Food[];
            createdAt: string;
        };
    }
}
