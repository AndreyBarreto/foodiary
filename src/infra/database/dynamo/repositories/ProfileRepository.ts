import { Injectable } from "@kernel/decorators/Injectable";
import { PutCommand, PutCommandInput } from "@aws-sdk/lib-dynamodb";
import { AppConfig } from "@shared/config/appconfig";
import { dynamoClient } from "../../../clients/dynamoClient";
import { Profile } from "@application/entities/Profile";
import { ProfileItem } from "../items/ProfileItem";


@Injectable()
export class ProfileRepository {
    constructor(private readonly config: AppConfig) { }

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
}

