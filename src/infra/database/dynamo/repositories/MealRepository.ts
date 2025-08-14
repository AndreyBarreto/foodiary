import { Injectable } from "@kernel/decorators/Injectable";
import { GetCommand, PutCommand, PutCommandInput } from "@aws-sdk/lib-dynamodb";
import { AppConfig } from "@shared/config/appconfig";
import { dynamoClient } from "../../../clients/dynamoClient";
import { Meal } from "@application/entities/Meal";
import { MealItem } from "../items/MealItem";


@Injectable()
export class MealRepository {
    constructor(private readonly config: AppConfig) { }

    getPutCommand(meal: Meal): PutCommandInput {
        const mealItem = MealItem.fromEntity(meal);
        return {
            TableName: this.config.database.dynamodb.mainTable.name,
            Item: mealItem.toItem(),
        };
    }
    async create(meal: Meal): Promise<void> {
        await dynamoClient.send(new PutCommand(this.getPutCommand(meal)));
    }
    async findById({ accountId, mealId }: MealRepository.FindMealByIdParams): Promise<Meal | null> {
        const command = new GetCommand({
            TableName: this.config.database.dynamodb.mainTable.name,
            Key: { PK: MealItem.getPk({ accountId, mealId }), SK: MealItem.getSk({ accountId, mealId }) },
        });
        const { Item: mealItem } = await dynamoClient.send(command);

        if (!mealItem) return null;

        return MealItem.toEntity(mealItem as MealItem.ItemType);
    }
}

export namespace MealRepository {
    export type FindMealByIdParams = {
        accountId: string;
        mealId: string;
    }
    export type FindMealByIdOutput = {
        meal: Meal;
    }
}
