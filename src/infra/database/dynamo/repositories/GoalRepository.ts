import { Injectable } from "@kernel/decorators/Injectable";
import { PutCommand, PutCommandInput } from "@aws-sdk/lib-dynamodb";
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
}

