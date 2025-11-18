import { AppConfig } from "@shared/config/appconfig";
import { Injectable } from "@kernel/decorators/Injectable";
import { Meal } from "@application/entities/Meal";
import KSUID from "ksuid";
import { s3Client } from "../clients/s3Client";
import { createPresignedPost } from "@aws-sdk/s3-presigned-post";
import { HeadObjectCommand } from "@aws-sdk/client-s3";


@Injectable()
export class MealsFileStorageGateway {
    constructor(private readonly appConfig: AppConfig) { }

    static generateInputFileKey({ accountId, inputType }: MealsFileStorageGateway.GenerateInputFileKeyParams): string {
        const extension = inputType === Meal.InputType.AUDIO ? "m4a" : "jpeg";
        const fileName = `${KSUID.randomSync().string}.${extension}`;

        return `${accountId}/${fileName}`;
    }
    getInputFileURL(fileKey: string): string {
        const bucket = this.appConfig.cdn.meals.mealsCDN;
        return `https://${bucket}/${fileKey}`;
    }

    async createPOST({ accountId, mealId, file }: MealsFileStorageGateway.CreatePOSTParams): Promise<MealsFileStorageGateway.CreatePOSTResult> {
        const contentType = file.inputType === Meal.InputType.AUDIO ? "audio/m4a" : "image/jpeg";
        const bucket = this.appConfig.storage.mealsBucket;
        const FIVE_MINUTES_IN_SECONDS = 60 * 5;

        const { url, fields } = await createPresignedPost(s3Client, {
            Bucket: bucket,
            Key: file.fileKey,
            Expires: FIVE_MINUTES_IN_SECONDS,
            Conditions: [
                { bucket },
                ["eq", "$key", file.fileKey],
                ["eq", "$Content-Type", contentType],
                ["content-length-range", file.fileSize, file.fileSize],
            ],
            Fields: {
                "x-amz-meta-mealid": mealId,
                "x-amz-meta-accountid": accountId,
            }
        })

        return {
            uploadSignature: Buffer.from(JSON.stringify({ url, fields: { ...fields, "Content-Type": contentType } })).toString("base64"),
        }

    }
    async getFileMetadata({ fileKey }: MealsFileStorageGateway.GetFileMetadataParams): Promise<MealsFileStorageGateway.GetFileMetadataResult> {
        console.log("getting file metadata for file key: ", fileKey);
        const command = new HeadObjectCommand({
            Bucket: this.appConfig.storage.mealsBucket,
            Key: fileKey,
        })
        console.log("sending command to get file metadata: ", command);
        const { Metadata = {} } = await s3Client.send(command);

        if (!Metadata.accountid || !Metadata.mealid) {
            console.log("file metadata not found for file key: ", fileKey);
            throw new Error("File metadata not found for file key: " + fileKey);
        }

        console.log("file metadata found for file key: ", fileKey);
        return {
            accountId: Metadata.accountid,
            mealId: Metadata.mealid,
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

        mealId: string;
        accountId: string;

        file: {
            fileKey: string;
            inputType: Meal.InputType;
            fileSize: number;
        }
    };
    export type CreatePOSTResult = {
        uploadSignature: string;
    };

    export type GetFileMetadataParams = {
        fileKey: string;
    };
    export type GetFileMetadataResult = {
        accountId: string;
        mealId: string;
    };
}
