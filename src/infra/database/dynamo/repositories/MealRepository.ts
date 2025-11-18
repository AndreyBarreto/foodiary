import { Injectable } from "@kernel/decorators/Injectable";
import { GetCommand, PutCommand, PutCommandInput, UpdateCommand } from "@aws-sdk/lib-dynamodb";
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
        console.log("finding meal by id: ", { accountId, mealId });
        const command = new GetCommand({
            TableName: this.config.database.dynamodb.mainTable.name,
            Key: { PK: MealItem.getPk({ accountId, mealId }), SK: MealItem.getSk({ accountId, mealId }) },
        });
        const { Item: mealItem } = await dynamoClient.send(command);

        if (!mealItem) {
            return null;
        }
        console.log("meal found: ", mealItem);

        return MealItem.toEntity(mealItem as MealItem.ItemType);
    }
    async save(meal: Meal): Promise<void> {
        console.log("saving meal: ", meal);
        const mealItem = MealItem.fromEntity(meal).toItem();
        const command = new UpdateCommand({
            TableName: this.config.database.dynamodb.mainTable.name,
            Key: { PK: mealItem.PK, SK: mealItem.SK },
            UpdateExpression: "SET #status = :status, #attempts = :attempts, #name = :name, #icon = :icon, #foods = :foods",
            ExpressionAttributeNames: { "#status": "status", "#attempts": "attempts", "#name": "name", "#icon": "icon", "#foods": "foods" },
            ExpressionAttributeValues: { ":status": mealItem.status, ":attempts": mealItem.attempts, ":name": mealItem.name, ":icon": mealItem.icon, ":foods": mealItem.foods },
            ReturnValues: "NONE",
        });
        console.log("command to save meal: ", command);
        await dynamoClient.send(command);
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
