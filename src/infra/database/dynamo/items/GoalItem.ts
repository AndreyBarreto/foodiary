import { AccountItem } from "./AccountItem";
import { Goal } from "@application/entities/Goal";

export class GoalItem {
    private readonly type = "Goal"
    private readonly keys: GoalItem.Keys;
    constructor(private readonly attr: GoalItem.Attributes) {
        this.keys = {
            PK: GoalItem.getPk(attr.accountId),
            SK: GoalItem.getSk(attr.accountId),
        };
    }

    static fromEntity(goal: Goal): GoalItem {
        return new GoalItem({
            ...goal,
            createdAt: goal.createdAt.toISOString(),
        });
    }

    static toEntity(goalItem: GoalItem.ItemType): Goal {
        return new Goal({
            accountId: goalItem.accountId,
            createdAt: new Date(goalItem.createdAt),
            calories: goalItem.calories,
            protein: goalItem.protein,
            carbohydrates: goalItem.carbohydrates,
            fats: goalItem.fats,
        });
    }

    static getPk(accountId: string): GoalItem.Keys["PK"] {
        return `ACCOUNT#${accountId}`;
    }
    static getSk(accountId: string): GoalItem.Keys["SK"] {
        return `ACCOUNT#${accountId}#GOAL`;
    }

    toItem(): GoalItem.ItemType {
        return {
            ...this.attr,
            ...this.keys,
            type: this.type,
        };
    }
}

export namespace GoalItem {

    export type Keys = {
        PK: AccountItem.Keys["PK"];
        SK: `ACCOUNT#${string}#GOAL`;
    };

    export type Attributes = {
        accountId: string;
        calories: number;
        protein: number;
        carbohydrates: number;
        fats: number;
        createdAt: string;
    };
    export type ItemType = Keys & Attributes & { type: "Goal" };
}
