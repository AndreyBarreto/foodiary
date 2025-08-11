import { Injectable } from "@kernel/decorators/Injectable";
import { PutCommand, PutCommandInput } from "@aws-sdk/lib-dynamodb";
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
}

