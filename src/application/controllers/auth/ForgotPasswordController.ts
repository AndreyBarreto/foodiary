import { Controller } from "../../contracts/Controller";
import { Schema } from "@kernel/decorators/Schema";
import { Injectable } from "@kernel/decorators/Injectable";
import { forgotPasswordSchema, ForgotPasswordBody } from "./schemas/forgotPasswordSchema";
import { ForgotPasswordUseCase } from "@application/usecases/auth/ForgotPasswordUseCase";



@Injectable()
@Schema(forgotPasswordSchema)
export class ForgotPasswordController extends Controller<"public", ForgotPasswordController.Response> {
    constructor(private readonly forgotPasswordUseCase: ForgotPasswordUseCase) {
        super();
    }
    protected override async handle({ body }: Controller.Request<"public", ForgotPasswordBody>): Promise<Controller.Response<ForgotPasswordController.Response>> {
        const { email } = body

        await this.forgotPasswordUseCase.execute({ email });

        return {
            statusCode: 204,
        };
    }
}


export namespace ForgotPasswordController {
    export type Response = void;
}
