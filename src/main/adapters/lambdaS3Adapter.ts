import { IFileEventHandler } from "@application/contracts/IFileEventHandler";
import { S3Event, S3Handler } from "aws-lambda";

export function lambdaS3Adapter(eventHandler: IFileEventHandler): S3Handler {

    return async (event: S3Event) => {
        const responses = await Promise.allSettled(event.Records.map(record => {
            eventHandler.handle({ fileKey: record.s3.object.key });
        }));

        const failed = responses.filter(response => response.status === "rejected");

        for (const response of failed) {
            console.error(response.reason);
        }

    };
}
