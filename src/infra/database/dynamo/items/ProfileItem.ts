import { Profile } from "@application/entities/Profile";
import { AccountItem } from "./AccountItem";

export class ProfileItem {
    private readonly type = "Profile"
    private readonly keys: ProfileItem.Keys;
    constructor(private readonly attr: ProfileItem.Attributes) {
        this.keys = {
            PK: ProfileItem.getPk(attr.accountId),
            SK: ProfileItem.getSk(attr.accountId),
        };
    }

    static fromEntity(profile: Profile): ProfileItem {
        return new ProfileItem({
            ...profile,
            createdAt: profile.createdAt.toISOString(),
            birthDate: profile.birthDate.toISOString(),
        });
    }

    static toEntity(profileItem: ProfileItem.ItemType): Profile {
        return new Profile({
            accountId: profileItem.accountId,
            createdAt: new Date(profileItem.createdAt),
            name: profileItem.name,
            birthDate: new Date(profileItem.birthDate),
            gender: profileItem.gender,
            height: profileItem.height,
            weight: profileItem.weight,
            activityLevel: profileItem.activityLevel,
            goal: profileItem.goal,
        });
    }

    static getPk(accountId: string): ProfileItem.Keys["PK"] {
        return `ACCOUNT#${accountId}`;
    }
    static getSk(accountId: string): ProfileItem.Keys["SK"] {
        return `ACCOUNT#${accountId}#PROFILE`;
    }

    toItem(): ProfileItem.ItemType {
        return {
            ...this.attr,
            ...this.keys,
            type: this.type,
        };
    }
}

export namespace ProfileItem {

    export type Keys = {
        PK: AccountItem.Keys["PK"];
        SK: `ACCOUNT#${string}#PROFILE`;
    };

    export type Attributes = {
        accountId: string;
        name: string;
        birthDate: string;
        gender: Profile.Gender;
        height: number;
        weight: number;
        activityLevel: Profile.ActivityLevel;
        goal: Profile.Goal;
        createdAt: string;
    };
    export type ItemType = Keys & Attributes & { type: "Profile" };
}
