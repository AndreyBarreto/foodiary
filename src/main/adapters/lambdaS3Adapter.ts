import { IFileEventHandler } from "@application/contracts/IFileEventHandler";
import { S3Event, S3Handler } from "aws-lambda";

export function lambdaS3Adapter(eventHandler: IFileEventHandler): S3Handler {

    return async (event: S3Event) => {
        console.log("lambda s3 adapter received event: ", event);
        const responses = await Promise.allSettled(event.Records.map(record => {
            console.log("handling record: ", record);
            eventHandler.handle({ fileKey: record.s3.object.key });
        }));

        console.log("settled responses: ", responses);

        const failed = responses.filter(response => response.status === "rejected");
        console.log("rejected responses: ", failed);

        for (const response of failed) {
            console.error("failed response: ", response.reason);
        }
        console.log("lambda s3 adapter completed");

    };
}
