import { UnitOfWork } from "./UnitOfWork";
import { Goal } from "@application/entities/Goal";
import { Profile } from "@application/entities/Profile";
import { Account } from "@application/entities/Account";
import { Injectable } from "@kernel/decorators/Injectable";
import { ProfileRepository } from "../repositories/ProfileRepository";
import { AccountRepository } from "../repositories/AccountRepository";
import { GoalRepository } from "../repositories/GoalRepository";

@Injectable()
export class SignUpUnitOfWork extends UnitOfWork {
    constructor(
        private readonly profileRepository: ProfileRepository,
        private readonly accountRepository: AccountRepository,
        private readonly goalRepository: GoalRepository
    ) {
        super();
    }

    async run({ account, profile, goal }: SignUpUnitOfWork.RunParams) {

        this.addPut(this.accountRepository.getPutCommand(account));
        this.addPut(this.profileRepository.getPutCommand(profile));
        this.addPut(this.goalRepository.getPutCommand(goal));

        await this.commit();
    }
}

export namespace SignUpUnitOfWork {
    export type RunParams = {
        account: Account;
        profile: Profile;
        goal: Goal;
    };
}
