import { AppConfig } from "@shared/config/appconfig";
import { Injectable } from "@kernel/decorators/Injectable";

@Injectable()
export class MealsFileStorageGateway {
    constructor(private readonly appConfig: AppConfig) { }
}

export namespace MealsFileStorageGateway {
    export type UploadMealFileParams = {
        file: File;
    };
    export type UploadMealFileResult = {
        url: string;
    };
}
