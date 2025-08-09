import { Profile } from "@application/entities/Profile"
import { Injectable } from "@kernel/decorators/Injectable";
import { AppConfig } from "@shared/config/appconfig";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { AccountItem } from "@infra/database/dynamo/items/AccountItem";
import { dynamoClient } from "@infra/clients/dynamoClient";
import { ProfileItem } from "@infra/database/dynamo/items/ProfileItem";
import { GoalItem } from "@infra/database/dynamo/items/GoalItem";
import { ResourceNotFound } from "@application/errors/application/ResourceNotFound";


@Injectable()
export class GetProfileAndGoalQuery {
    constructor(
        private readonly config: AppConfig
    ) { }

    async execute({ accountId }: GetProfileAndGoalQuery.Input): Promise<GetProfileAndGoalQuery.Output> {
        const command = new QueryCommand({
            TableName: this.config.database.dynamodb.mainTable.name,
            Limit: 2,
            ProjectionExpression: "#PK, #SK, #name, #birthDate, #gender, #height, #weight, #calories, #proteins, #carbohydrates, #fats,#type",
            KeyConditionExpression: "PK = :PK AND begins_with(#SK, :SK)",
            ExpressionAttributeNames: {
                "#SK": "SK",
                "#PK": "PK",
                "#name": "name",
                "#birthDate": "birthDate",
                "#gender": "gender",
                "#height": "height",
                "#weight": "weight",
                "#calories": "calories",
                "#proteins": "proteins",
                "#carbohydrates": "carbohydrates",
                "#fats": "fats",
                "#type": "type",
            },
            ExpressionAttributeValues: {
                ":PK": AccountItem.getPk(accountId),
                ":SK": `${AccountItem.getPk(accountId)}#`
            }
        })
        const { Items = [] } = await dynamoClient.send(command)
        const profile = Items.find(((item): item is ProfileItem.ItemType => item.type === ProfileItem.type))
        const goal = Items.find(((item): item is GoalItem.ItemType => item.type === GoalItem.type))

        if (!profile || !goal) {
            throw new ResourceNotFound("Profile or goal not found")
        }

        return {
            profile: {
                name: profile.name,
                birthDate: profile.birthDate,
                gender: profile.gender,
                height: profile.height,
                weight: profile.weight
            },
            goal: {
                calories: goal.calories,
                proteins: goal.protein,
                carbohydrates: goal.carbohydrates,
                fats: goal.fats
            }
        }
    }




}

export namespace GetProfileAndGoalQuery {
    export type Input = {
        accountId: string
    }

    export type Output = {
        profile: {
            name: string
            birthDate: string
            gender: Profile.Gender
            height: number
            weight: number
        }
        goal: {
            calories: number
            proteins: number
            carbohydrates: number
            fats: number
        }
    }
}
