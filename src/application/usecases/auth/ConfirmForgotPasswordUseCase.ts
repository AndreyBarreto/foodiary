import { Injectable } from "@kernel/decorators/Injectable";
import { AuthGateway } from "../../../infra/gateways/AuthGateway";

@Injectable()
export class ConfirmForgotPasswordUseCase {
    constructor(
        private readonly authGateway: AuthGateway) { }

    async execute({ email, code, newPassword }: ConfirmForgotPasswordUseCase.Input): Promise<ConfirmForgotPasswordUseCase.Output> {

        await this.authGateway.confirmForgotPassword({ email, code, newPassword });
    }
}

export namespace ConfirmForgotPasswordUseCase {
    export type Input = {
        email: string;
        code: string;
        newPassword: string;
    };

    export type Output = void;
}
