import { Injectable } from "@kernel/decorators/Injectable";
import { Meal } from "@application/entities/Meal";
import { MealsFileStorageGateway } from "@infra/gateways/MealsFileStorageGateway";
import { MealRepository } from "@infra/database/dynamo/repositories/MealRepository";


@Injectable()
export class GetMealByIdUseCase {

    constructor(
        private readonly mealRepository: MealRepository,
        private readonly mealsFileStorageGateway: MealsFileStorageGateway) { }

    async execute({ accountId, mealId }: GetMealByIdUseCase.Input): Promise<GetMealByIdUseCase.Output> { }
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
            inputFileKey: string;
            name: string;
            icon: string;
            foods: Meal.Food[];
            createdAt: string;
        };
    }
}
