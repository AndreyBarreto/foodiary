import { Meal } from "@application/entities/Meal";

export class MealItem {
    private readonly keys: MealItem.Keys;
    private readonly type = "Meal"
    constructor(private readonly attr: MealItem.Attributes) {
        this.keys = {
            PK: MealItem.getPk(attr.id),
            SK: MealItem.getSk(attr.id),
            GSI1PK: MealItem.getGsi1Pk({ accountId: attr.accountId, createdAt: new Date(attr.createdAt) }),
            GSI1SK: MealItem.getGsi1Sk(attr.id),
        };
    }
    static fromEntity(meal: Meal): MealItem {
        return new MealItem({
            ...meal,
            createdAt: meal.createdAt.toISOString(),
            attempts: meal.attempts ?? 0,
        });
    }

    static toEntity(mealItem: MealItem.ItemType): Meal {
        return new Meal({
            id: mealItem.id,
            accountId: mealItem.accountId,
            createdAt: new Date(mealItem.createdAt),
            status: mealItem.status,
            attempts: mealItem.attempts,
            inputType: mealItem.inputType,
            inputFileKey: mealItem.inputFileKey,
            name: mealItem.name,
            icon: mealItem.icon,
            foods: mealItem.foods,
        });
    }

    static getPk(mealId: string): MealItem.Keys["PK"] {
        return `MEAL#${mealId}`;
    }
    static getSk(mealId: string): MealItem.Keys["SK"] {
        return `MEAL#${mealId}`;
    }
    static getGsi1Pk({ accountId, createdAt }: MealItem.GSI1PKParams): MealItem.Keys["GSI1PK"] {
        const year = createdAt.getFullYear();
        const month = String(createdAt.getMonth() + 1).padStart(2, "0");
        const day = String(createdAt.getDate()).padStart(2, "0");
        return `MEALS#${accountId}#${year}-${month}-${day}`;
    }
    static getGsi1Sk(mealId: string): MealItem.Keys["GSI1SK"] {
        return `MEAL#${mealId}`;
    }

    toItem(): MealItem.ItemType {
        return {
            ...this.attr,
            ...this.keys,
            type: this.type,
        };
    }
}

export namespace MealItem {

    export type Keys = {
        PK: `MEAL#${string}`;
        SK: `MEAL#${string}`;
        GSI1PK: `MEALS#${string}#${string}-${string}-${string}`;
        GSI1SK: `MEAL#${string}`;
    };

    export type Attributes = {
        accountId: string;
        id: string;
        createdAt: string;
        status: Meal.Status;
        attempts: number;
        inputType: Meal.InputType;
        inputFileKey: string;
        name?: string;
        icon?: string;
        foods?: Meal.Food[];
    };
    export type ItemType = Keys & Attributes & { type: "Meal" };

    export type GSI1PKParams = {
        accountId: string;
        createdAt: Date;
    }
}
