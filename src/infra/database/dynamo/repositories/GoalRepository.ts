import { Injectable } from "@kernel/decorators/Injectable";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { AppConfig } from "@shared/config/appconfig";
import { dynamoClient } from "../../../clients/dynamoClient";
import { GoalItem } from "../items/GoalItem";
import { Goal } from "@application/entities/Goal";


@Injectable()
export class GoalRepository {
    constructor(private readonly config: AppConfig) { }

    async create(goal: Goal): Promise<void> {
        const goalItem = GoalItem.fromEntity(goal);

        const command = new PutCommand({
            TableName: this.config.database.dynamodb.mainTable.name,
            Item: goalItem.toItem(),
        });

        await dynamoClient.send(command);
    }
}

