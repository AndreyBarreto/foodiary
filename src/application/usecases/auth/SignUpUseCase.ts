import { Injectable } from "@kernel/decorators/Injectable";
import { AuthGateway } from "../../../infra/gateways/AuthGateway";
import { Account } from "@application/entities/Account";
import { AccountRepository } from "../../../infra/database/dynamo/repositories/AccountRepository";

@Injectable()
export class SignUpUseCase {
    constructor(
        private readonly authGateway: AuthGateway,
        private readonly accountRepository: AccountRepository) { }

    async execute({ email, password }: SignUpUseCase.Input): Promise<SignUpUseCase.Output> {
        const existingAccount = await this.accountRepository.findByEmail(email);

        if (existingAccount) {
            throw new Error("Account already exists");
        }

        const { externalId } = await this.authGateway.signUp({ email, password });

        const account = new Account({
            email,
            externalId,
        });

        await this.accountRepository.create(account);

        const { accessToken, refreshToken } = await this.authGateway.signIn({ email, password });

        return {
            accessToken,
            refreshToken,
        };
    }
}

export namespace SignUpUseCase {
    export type Input = {
        email: string;
        password: string;
    };

    export type Output = {
        accessToken: string;
        refreshToken: string;
    };
}
