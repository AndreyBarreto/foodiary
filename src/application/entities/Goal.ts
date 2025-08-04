export class Goal {
    readonly accountId: string;
    readonly calories: number;
    readonly protein: number;
    readonly carbohydrates: number;
    readonly fats: number;
    readonly createdAt: Date;

    constructor(attributes: Goal.Attributes) {
        this.accountId = attributes.accountId;
        this.calories = attributes.calories;
        this.protein = attributes.protein;
        this.carbohydrates = attributes.carbohydrates;
        this.fats = attributes.fats;
        this.createdAt = attributes.createdAt ?? new Date();
    }
}

export namespace Goal {
    export type Attributes = {
        accountId: string;
        calories: number;
        protein: number;
        carbohydrates: number;
        fats: number;
        createdAt?: Date;
    };
}
