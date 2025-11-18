import { Injectable } from "@kernel/decorators/Injectable";
import { AppConfig } from "@shared/config/appconfig";
import { SendMessageCommand } from "@aws-sdk/client-sqs";
import { sqsClient } from "@infra/clients/sqsClient";

@Injectable()
export class MealsQueueGateway {
    constructor(private readonly appConfig: AppConfig) { }
    async publishMessage(message: MealsQueueGateway.Message): Promise<void> {
        console.log("publishing message to meals queue: ", message);
        const command = new SendMessageCommand({
            QueueUrl: this.appConfig.queues.mealsQueueURL,
            MessageBody: JSON.stringify(message),
        });
        console.log("sending command to publish message: ", command);
        await sqsClient.send(command);
        console.log("message published to meals queue successfully");
    }
}
export namespace MealsQueueGateway {
    export type Message = {
        accountId: string;
        mealId: string;
    }
    export type SendMessageResult = void;
}
