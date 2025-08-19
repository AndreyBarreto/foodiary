import { Injectable } from "@kernel/decorators/Injectable";
import { GetCommand, PutCommand, PutCommandInput, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { AppConfig } from "@shared/config/appconfig";
import { dynamoClient } from "../../../clients/dynamoClient";
import { GoalItem } from "../items/GoalItem";
import { Goal } from "@application/entities/Goal";


@Injectable()
export class GoalRepository {
    constructor(private readonly config: AppConfig) { }

    getPutCommand(goal: Goal): PutCommandInput {
        const goalItem = GoalItem.fromEntity(goal);
        return {
            TableName: this.config.database.dynamodb.mainTable.name,
            Item: goalItem.toItem(),
        };
    }

    async create(goal: Goal): Promise<void> {
        await dynamoClient.send(new PutCommand(this.getPutCommand(goal)));
    }
    async findByAccountId(accountId: string): Promise<Goal | null> {
        const command = new GetCommand({
            TableName: this.config.database.dynamodb.mainTable.name,
            Key: {
                PK: GoalItem.getPk(accountId),
                SK: GoalItem.getSk(accountId)
            }
        });

        const { Item: goalItem } = await dynamoClient.send(command);
        if (!goalItem) {
            return null;
        }
        return GoalItem.toEntity(goalItem as GoalItem.ItemType);
    }
    async save(goal: Goal): Promise<void> {
        const goalItem = GoalItem.fromEntity(goal).toItem();
        const command = new UpdateCommand({
            TableName: this.config.database.dynamodb.mainTable.name,
            Key: {
                PK: goalItem.PK,
                SK: goalItem.SK
            },
            UpdateExpression: "SET #calories = :calories, #protein = :protein, #carbohydrates = :carbohydrates, #fats = :fats",
            ExpressionAttributeNames: {
                "#calories": "calories",
                "#protein": "protein",
                "#carbohydrates": "carbohydrates",
                "#fats": "fats",
            },
            ExpressionAttributeValues: {
                ":calories": goalItem.calories,
                ":protein": goalItem.protein,
                ":carbohydrates": goalItem.carbohydrates,
                ":fats": goalItem.fats,
            },
            ReturnValues: "NONE",
        });

        await dynamoClient.send(command);
    }
}

