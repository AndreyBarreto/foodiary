import { SignUpUseCase } from "@application/usecases/auth/SignUpUseCase";
import { Controller } from "../../contracts/Controller";
import { signUpSchema, SignUpBody } from "./schemas/signUpSchema";
import { Schema } from "@kernel/decorators/Schema";
import { Injectable } from "@kernel/decorators/Injectable";



@Injectable()
@Schema(signUpSchema)
export class SignUpController extends Controller<SignUpBody, SignUpController.Response> {
    constructor(private readonly signUpUseCase: SignUpUseCase) {
        super();
    }
    protected override async handle({ body }: Controller.Request<SignUpBody>): Promise<Controller.Response<SignUpController.Response>> {
        const { account } = body
        const { accessToken, refreshToken } = await this.signUpUseCase.execute(account);
        return {
            statusCode: 201,
            body: { accessToken, refreshToken }
        };
    }
}


export namespace SignUpController {
    export type Response = {
        accessToken: string;
        refreshToken: string;
    };
}
