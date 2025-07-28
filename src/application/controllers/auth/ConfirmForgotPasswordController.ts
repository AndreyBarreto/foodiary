import { Controller } from "../../contracts/Controller";
import { Schema } from "@kernel/decorators/Schema";
import { Injectable } from "@kernel/decorators/Injectable";
import { confirmForgotPasswordSchema, ConfirmForgotPasswordBody } from "./schemas/confirmForgotPasswordSchema";
import { ConfirmForgotPasswordUseCase } from "@application/usecases/auth/ConfirmForgotPasswordUseCase";



@Injectable()
@Schema(confirmForgotPasswordSchema)
export class ConfirmForgotPasswordController extends Controller<"public", ConfirmForgotPasswordController.Response> {
    constructor(private readonly confirmForgotPasswordUseCase: ConfirmForgotPasswordUseCase) {
        super();
    }
    protected override async handle({ body }: Controller.Request<"public", ConfirmForgotPasswordBody>): Promise<Controller.Response<ConfirmForgotPasswordController.Response>> {
        const { email, code, newPassword } = body

        await this.confirmForgotPasswordUseCase.execute({ email, code, newPassword });

        return {
            statusCode: 204,
        };
    }
}


export namespace ConfirmForgotPasswordController {
    export type Response = void;
}
