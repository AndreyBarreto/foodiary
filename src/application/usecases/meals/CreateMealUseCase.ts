import { Meal } from "@application/entities/Meal";
import { Injectable } from "@kernel/decorators/Injectable";
import { MealRepository } from "@infra/database/dynamo/repositories/MealRepository";
import { MealsFileStorageGateway } from "@infra/gateways/MealsFileStorageGateway";

@Injectable()
export class CreateMealUseCase {
    constructor(
        private readonly mealRepository: MealRepository,
        private readonly mealsFileStorageGateway: MealsFileStorageGateway) { }

    async execute({ accountId, file }: CreateMealUseCase.Input): Promise<CreateMealUseCase.Output> {
        const meal = new Meal({
            accountId,
            inputType: file.type,
            inputFileKey: MealsFileStorageGateway.generateInputFileKey({
                accountId,
                inputType: file.type,
            }),
            status: Meal.Status.UPLOADING,

        });

        const [, { uploadSignature }] = await Promise.all([
            this.mealRepository.create(meal),
            this.mealsFileStorageGateway.createPOST({
                mealId: meal.id,
                accountId,
                file: {
                    fileKey: meal.inputFileKey,
                    inputType: meal.inputType,
                    fileSize: file.size,
                }
            }),
        ]);

        return {
            mealId: meal.id,
            uploadSignature,
        };
    }
}

export namespace CreateMealUseCase {
    export type Input = {
        accountId: string;
        file: {
            type: Meal.InputType;
            size: number;
        }
    }

    export type Output = {
        mealId: string;
        uploadSignature: string;
    }
}
