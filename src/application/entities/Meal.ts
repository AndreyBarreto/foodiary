import KSUID from "ksuid";

export class Meal {
    readonly id: string;
    readonly accountId: string;
    readonly createdAt: Date;
    status: Meal.Status;
    attempts?: number;
    readonly inputType: Meal.InputType;
    readonly inputFileKey: string;
    name?: string;
    icon?: string;
    foods?: Meal.Food[];

    constructor(attributes: Meal.Attributes) {
        this.id = attributes.id ?? KSUID.randomSync().string;
        this.accountId = attributes.accountId;
        this.createdAt = attributes.createdAt ?? new Date();
        this.status = attributes.status ?? Meal.Status.UPLOADING;
        this.inputType = attributes.inputType ?? Meal.InputType.AUDIO;
        this.name = attributes.name ?? "";
        this.icon = attributes.icon ?? "";
        this.foods = attributes.foods ?? [];
        this.attempts = attributes.attempts ?? 0;
        this.inputFileKey = attributes.inputFileKey;
    }
}

export namespace Meal {
    export type Attributes = {
        accountId: string;
        id?: string;
        createdAt?: Date;
        status?: Status;
        attempts?: number;
        inputType: InputType;
        name?: string;
        icon?: string;
        foods?: Food[];
        inputFileKey: string;
    };

    export enum Status {
        UPLOADING = "UPLOADING",
        QUEUED = "QUEUED",
        PROCESSING = "PROCESSING",
        SUCCESS = "SUCCESS",
        FAILED = "FAILED",
    }

    export enum InputType {
        AUDIO = "AUDIO",
        PICTURE = "PICTURE",
    }
    export type Food = {
        name: string;
        quantity: number;
        calories: number;
        protein: number;
        carbohydrates: number;
        fats: number;
    }
}
