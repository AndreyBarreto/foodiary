import { Account } from "@application/entities/Account";

export class AccountItem {
    private readonly keys: AccountItem.Keys;
    private readonly type = "Account"
    constructor(private readonly attr: AccountItem.Attributes) {
        this.keys = {
            PK: AccountItem.getPk(attr.id),
            SK: AccountItem.getSk(attr.id),
            GSI1PK: AccountItem.getGsi1Pk(attr.email),
            GSI1SK: AccountItem.getGsi1Sk(attr.email),
        };
    }
    static fromEntity(account: Account): AccountItem {
        return new AccountItem({
            ...account,
            createdAt: account.createdAt.toISOString(),
        });
    }

    static toEntity(accountItem: AccountItem.ItemType): Account {
        return new Account({
            id: accountItem.id,
            email: accountItem.email,
            externalId: accountItem.externalId,
            createdAt: new Date(accountItem.createdAt),
        });
    }

    static getPk(accountId: string): AccountItem.Keys["PK"] {
        return `ACCOUNT#${accountId}`;
    }
    static getSk(accountId: string): AccountItem.Keys["SK"] {
        return `ACCOUNT#${accountId}`;
    }
    static getGsi1Pk(email: string): AccountItem.Keys["GSI1PK"] {
        return `ACCOUNT#${email}`;
    }
    static getGsi1Sk(email: string): AccountItem.Keys["GSI1SK"] {
        return `ACCOUNT#${email}`;
    }

    toItem(): AccountItem.ItemType {
        return {
            ...this.attr,
            ...this.keys,
            type: this.type,
        };
    }
}

export namespace AccountItem {

    export type Keys = {
        PK: `ACCOUNT#${string}`;
        SK: `ACCOUNT#${string}`;
        GSI1PK: `ACCOUNT#${string}`;
        GSI1SK: `ACCOUNT#${string}`;
    };

    export type Attributes = {
        id: string;
        email: string;
        externalId: string | undefined;
        createdAt: string;
    };
    export type ItemType = Keys & Attributes & { type: "Account" };
}
