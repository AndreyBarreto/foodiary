import { Injectable } from "@kernel/decorators/Injectable";
import { Meal } from "@application/entities/Meal";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { AppConfig } from "@shared/config/appconfig";
import { MealItem } from "@infra/database/dynamo/items/MealItem";
import { dynamoClient } from "@infra/clients/dynamoClient";

@Injectable()
export class ListMealsByDayQuery {
    constructor(private readonly appConfig: AppConfig) { }
    async execute({ accountId, date }: ListMealsByDayQuery.Input): Promise<ListMealsByDayQuery.Output> {
        const command = new QueryCommand({
            TableName: this.appConfig.database.dynamodb.mainTable.name,
            IndexName: "GSI1",
            KeyConditionExpression: "#GSI1PK = :GSI1PK",
            ExpressionAttributeNames: {
                "#GSI1PK": "GSI1PK",
                "#id": "id",
                "#createdAt": "createdAt",
                "#name": "name",
                "#icon": "icon",
                "#foods": "foods",
            },
            ExpressionAttributeValues: {
                ":GSI1PK": MealItem.getGsi1Pk({ accountId, createdAt: date }),
            },
            ProjectionExpression: "#GSI1PK, #id, #createdAt, #name, #icon, #foods",

        });
        const { Items = [] } = await dynamoClient.send(command);
        const items = Items as ListMealsByDayQuery.MealItemType[];

        const meals: ListMealsByDayQuery.Output["meals"] = items.map((item) => ({
            id: item.id,
            createdAt: item.createdAt,
            name: item.name,
            icon: item.icon,
            foods: item.foods,
        }));

        return {
            meals
        }
    }
}


export namespace ListMealsByDayQuery {
    export type Input = {
        accountId: string
        date: Date
    }
    export type Output = {
        meals: {
            id: string,
            createdAt: string,
            name: string,
            icon: string,
            foods: Meal.Food[]
        }[]
    }
    export type MealItemType = {
        GSI1PK: string,
        id: string,
        createdAt: string,
        name: string,
        icon: string,
        foods: Meal.Food[]
    }
}
