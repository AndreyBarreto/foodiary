import { AppConfig } from "@shared/config/appconfig";
import { Injectable } from "@kernel/decorators/Injectable";
import { Meal } from "@application/entities/Meal";
import KSUID from "ksuid";
import { s3Client } from "../clients/s3Client";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";


@Injectable()
export class MealsFileStorageGateway {
    constructor(private readonly appConfig: AppConfig) { }

    static generateInputFileKey({ accountId, inputType }: MealsFileStorageGateway.GenerateInputFileKeyParams): string {
        const extension = inputType === Meal.InputType.AUDIO ? "m4a" : "jpeg";
        const fileName = `${KSUID.randomSync().string}.${extension}`;

        return `${accountId}/${fileName}`;
    }

    async createPOST({ fileKey, inputType, fileSize }: MealsFileStorageGateway.CreatePOSTParams): Promise<MealsFileStorageGateway.CreatePOSTResult> {
        const contentType = inputType === Meal.InputType.AUDIO ? "audio/m4a" : "image/jpeg";
        const bucket = this.appConfig.storage.mealsBucket;
        const FIVE_MINUTES_IN_SECONDS = 60 * 5;

        const { url, fields } = await createPresignedPost(s3Client, {
            Bucket: bucket,
            Key: fileKey,
            Expires: FIVE_MINUTES_IN_SECONDS,
            Conditions: [
                { bucket },
                ["eq", "$key", fileKey],
                ["eq", "$Content-Type", contentType],
                ["content-length-range", fileSize, fileSize],
            ]
        })

        return {
            uploadSignature: Buffer.from(JSON.stringify({ url, fields: { ...fields, "Content-Type": contentType } })).toString("base64"),
        }
    }
}

export namespace MealsFileStorageGateway {
    export type GenerateInputFileKeyParams = {
        accountId: string;
        inputType: Meal.InputType;
    };
    export type GenerateInputFileKeyResult = {
        key: string;
    };
    export type UploadMealFileParams = {
        file: File;
    };
    export type UploadMealFileResult = {
        url: string;
    };
    export type CreatePOSTParams = {
        fileKey: string;
        inputType: Meal.InputType;
        fileSize: number;
    };
    export type CreatePOSTResult = {
        uploadSignature: string;
    };
}
