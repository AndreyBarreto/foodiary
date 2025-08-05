
export class Profile {
    readonly accountId: string;
    readonly createdAt: Date;
    readonly name: string;
    readonly birthDate: Date;
    readonly gender: Profile.Gender;
    readonly height: number;
    readonly weight: number;
    readonly activityLevel: Profile.ActivityLevel;
    readonly goal: Profile.Goal;

    constructor(attributes: Profile.Attributes) {
        this.accountId = attributes.accountId;
        this.createdAt = attributes.createdAt ?? new Date();
        this.name = attributes.name;
        this.birthDate = attributes.birthDate;
        this.gender = attributes.gender;
        this.height = attributes.height;
        this.weight = attributes.weight;
        this.activityLevel = attributes.activityLevel;
        this.goal = attributes.goal;
    }
}

export namespace Profile {

    export type Attributes = {
        accountId: string;
        createdAt?: Date;
        name: string;
        birthDate: Date;
        gender: Profile.Gender;
        height: number;
        weight: number;
        activityLevel: Profile.ActivityLevel;
        goal: Profile.Goal;
    };

    export enum Gender {
        MALE = "male",
        FEMALE = "female",
    }

    export enum ActivityLevel {
        SEDENTARY = "sedentary",
        LIGHT = "light",
        MODERATE = "moderate",
        HEAVY = "heavy",
        ATHLETE = "athlete",
    }

    export enum Goal {
        LOSE_WEIGHT = "lose_weight",
        MAINTAIN_WEIGHT = "maintain_weight",
        GAIN_WEIGHT = "gain_weight",
    }
}
