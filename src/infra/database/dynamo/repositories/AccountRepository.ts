import { Injectable } from "@kernel/decorators/Injectable";
import { Account } from "@application/entities/Account";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { AppConfig } from "@shared/config/appconfig";
import { dynamoClient } from "../../../clients/dynamoClient";
import { AccountItem } from "../items/AccountItem";
import { QueryCommand } from "@aws-sdk/client-dynamodb";


@Injectable()
export class AccountRepository {
    constructor(private readonly config: AppConfig) { }

    async findByEmail(email: string): Promise<Account | null> {

        const command = new QueryCommand({
            IndexName: "GSI1",
            TableName: this.config.database.dynamodb.mainTable.name,
            Limit: 1,
            KeyConditionExpression: "#GSI1PK = :GSI1PK AND #GSI1SK = :GSI1SK",
            ExpressionAttributeNames: {
                "#GSI1PK": "GSI1PK",
                "#GSI1SK": "GSI1SK",
            },
            ExpressionAttributeValues: {
                ":GSI1PK": { S: AccountItem.getGsi1Pk(email) },
                ":GSI1SK": { S: AccountItem.getGsi1Sk(email) },
            },
        });

        const { Items = [] } = await dynamoClient.send(command);

        const account = Items[0] as unknown as AccountItem.ItemType;

        if (!account) {
            return null;
        }

        return AccountItem.toEntity(account);
    }

    async create(account: Account): Promise<void> {
        const accountItem = AccountItem.fromEntity(account);

        const command = new PutCommand({
            TableName: this.config.database.dynamodb.mainTable.name,
            Item: accountItem.toItem(),
        });

        await dynamoClient.send(command);
    }
}

