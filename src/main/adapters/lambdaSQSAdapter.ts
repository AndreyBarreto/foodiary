import { IQueueConsumer } from "@application/contracts/IQueueConsumer";
import { SQSEvent, SQSHandler } from "aws-lambda";

export function lambdaSQSAdapter(consumer: IQueueConsumer<any>): SQSHandler {
    return async (event) => {
        console.log("lambda sqs adapter received event: ", event);
        await Promise.all(event.Records.map(record => {
            console.log("handling record: ", record);
            return consumer.process({ message: record.body });
        }));
    };
}
