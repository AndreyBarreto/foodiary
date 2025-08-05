import { PutCommandInput, TransactWriteCommand, TransactWriteCommandInput } from "@aws-sdk/lib-dynamodb";
import { dynamoClient } from "@infra/clients/dynamoClient";


export abstract class UnitOfWork {
    private transactItems: NonNullable<TransactWriteCommandInput["TransactItems"]> = [];

    protected addPut(item: PutCommandInput) {
        this.transactItems.push({
            Put: item,
        });
    }

    protected async commit(): Promise<void> {
        const command = new TransactWriteCommand({
            TransactItems: this.transactItems,
        });

        await dynamoClient.send(command);
    }
}
