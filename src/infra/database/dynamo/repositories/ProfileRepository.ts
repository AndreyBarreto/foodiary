import { Injectable } from "@kernel/decorators/Injectable";
import { GetCommand, PutCommand, PutCommandInput, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { AppConfig } from "@shared/config/appconfig";
import { dynamoClient } from "../../../clients/dynamoClient";
import { Profile } from "@application/entities/Profile";
import { ProfileItem } from "../items/ProfileItem";


@Injectable()
export class ProfileRepository {
    constructor(private readonly config: AppConfig) { }
    async findByAccountId(accountId: string): Promise<Profile | null> {
        const command = new GetCommand({
            TableName: this.config.database.dynamodb.mainTable.name,
            Key: {
                PK: ProfileItem.getPk(accountId),
                SK: ProfileItem.getSk(accountId)
            },
        });

        const { Item: profileItem } = await dynamoClient.send(command);

        if (!profileItem) {
            return null;
        }

        return ProfileItem.toEntity(profileItem as ProfileItem.ItemType);
    }

    getPutCommand(profile: Profile): PutCommandInput {
        const profileItem = ProfileItem.fromEntity(profile);
        return {
            TableName: this.config.database.dynamodb.mainTable.name,
            Item: profileItem.toItem(),
        };
    }

    async create(profile: Profile): Promise<void> {
        await dynamoClient.send(new PutCommand(this.getPutCommand(profile)));
    }

    async save(profile: Profile): Promise<void> {
        const profileItem = ProfileItem.fromEntity(profile).toItem();
        const command = new UpdateCommand({
            TableName: this.config.database.dynamodb.mainTable.name,
            Key: {
                PK: profileItem.PK,
                SK: profileItem.SK
            },
            UpdateExpression: "SET #name = :name, #birthDate = :birthDate, #gender = :gender, #height = :height, #weight = :weight",
            ExpressionAttributeNames: {
                "#name": "name",
                "#birthDate": "birthDate",
                "#gender": "gender",
                "#height": "height",
                "#weight": "weight",
            },
            ExpressionAttributeValues: {
                ":name": profileItem.name,
                ":birthDate": profileItem.birthDate,
                ":gender": profileItem.gender,
                ":height": profileItem.height,
                ":weight": profileItem.weight,
            },
            ReturnValues: "NONE",
        });

        await dynamoClient.send(command);
    }
}
