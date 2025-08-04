import { Injectable } from "@kernel/decorators/Injectable";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { AppConfig } from "@shared/config/appconfig";
import { dynamoClient } from "../../../clients/dynamoClient";
import { Profile } from "@application/entities/Profile";
import { ProfileItem } from "../items/ProfileItem";


@Injectable()
export class ProfileRepository {
    constructor(private readonly config: AppConfig) { }

    async create(profile: Profile): Promise<void> {
        const profileItem = ProfileItem.fromEntity(profile);

        const command = new PutCommand({
            TableName: this.config.database.dynamodb.mainTable.name,
            Item: profileItem.toItem(),
        });

        await dynamoClient.send(command);
    }
}

