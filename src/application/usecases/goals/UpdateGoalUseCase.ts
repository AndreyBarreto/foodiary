import { GoalRepository } from "@infra/database/dynamo/repositories/GoalRepository";
import { Injectable } from "@kernel/decorators/Injectable";
import { ResourceNotFound } from "@application/errors/application/ResourceNotFound";

@Injectable()
export class UpdateGoalUseCase {
    constructor(private readonly goalRepository: GoalRepository) { }

    async execute({ accountId, calories, protein, carbohydrates, fats }: UpdateGoalUseCase.Input): Promise<UpdateGoalUseCase.Output> {
        const goal = await this.goalRepository.findByAccountId(accountId);
        if (!goal) {
            throw new ResourceNotFound("Goal not found");
        }

        goal.calories = calories;
        goal.protein = protein;
        goal.carbohydrates = carbohydrates;
        goal.fats = fats;

        await this.goalRepository.save(goal);
    }
}

export namespace UpdateGoalUseCase {
    export type Input = {
        accountId: string
        calories: number
        protein: number
        carbohydrates: number
        fats: number
    }
    export type Output = void
}
