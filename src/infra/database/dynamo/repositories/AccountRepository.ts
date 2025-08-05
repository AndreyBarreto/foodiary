import { Injectable } from "@kernel/decorators/Injectable";
import { Account } from "@application/entities/Account";
import { PutCommand, PutCommandInput } from "@aws-sdk/lib-dynamodb";
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

    getPutCommand(account: Account): PutCommandInput {
        const accountItem = AccountItem.fromEntity(account);
        return {
            TableName: this.config.database.dynamodb.mainTable.name,
            Item: accountItem.toItem(),
        };
    }
    async create(account: Account): Promise<void> {
        await dynamoClient.send(new PutCommand(this.getPutCommand(account)));
    }
}

