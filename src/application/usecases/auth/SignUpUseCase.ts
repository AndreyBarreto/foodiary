import { Injectable } from "@kernel/decorators/Injectable";
import { AuthGateway } from "../../../infra/gateways/AuthGateway";
import { Account } from "@application/entities/Account";
import { AccountRepository } from "../../../infra/database/dynamo/repositories/AccountRepository";
import { EmailAlreadyInUse } from "@application/errors/application/EmailAlreadyInUse";
import { Profile } from "@application/entities/Profile";
import { Goal } from "@application/entities/Goal";
import { ProfileRepository } from "../../../infra/database/dynamo/repositories/ProfileRepository";
import { GoalRepository } from "../../../infra/database/dynamo/repositories/GoalRepository";

@Injectable()
export class SignUpUseCase {
    constructor(
        private readonly authGateway: AuthGateway,
        private readonly accountRepository: AccountRepository,
        private readonly profileRepository: ProfileRepository,
        private readonly goalRepository: GoalRepository
    ) { }

    async execute({ account, profile }: SignUpUseCase.Input): Promise<SignUpUseCase.Output> {
        const existingAccount = await this.accountRepository.findByEmail(account.email);

        if (existingAccount) {
            throw new EmailAlreadyInUse();
        }

        const accountEntity = new Account({
            email: account.email,
        });
        const profileEntity = new Profile({ ...profile, accountId: accountEntity.id });

        const goalEntity = new Goal({ calories: 2000, protein: 100, carbohydrates: 100, fats: 100, accountId: accountEntity.id });

        const { externalId } = await this.authGateway.signUp({ email: accountEntity.email, password: account.password, internalId: accountEntity.id });

        accountEntity.externalId = externalId;

        await Promise.all([
            this.accountRepository.create(accountEntity),
            this.profileRepository.create(profileEntity),
            this.goalRepository.create(goalEntity),
        ]);

        const { accessToken, refreshToken } = await this.authGateway.signIn({ email: accountEntity.email, password: account.password });

        return {
            accessToken,
            refreshToken,
        };
    }
}

export namespace SignUpUseCase {
    export type Input = {
        account: {
            email: string;
            password: string;
        },
        profile: {
            name: string;
            birthDate: Date;
            gender: Profile.Gender;
            height: number;
            weight: number;
            activityLevel: Profile.ActivityLevel;
        };
    };

    export type Output = {
        accessToken: string;
        refreshToken: string;
    };
}
