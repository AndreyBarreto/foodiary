import { Controller } from "../../contracts/Controller";
import { Schema } from "@kernel/decorators/Schema";
import { Injectable } from "@kernel/decorators/Injectable";
import { SignInBody, signInSchema } from "./schemas/signInSchema";
import { SignInUseCase } from "@application/usecases/auth/SignInUseCase";



@Injectable()
@Schema(signInSchema)
export class SignInController extends Controller<"public", SignInController.Response> {
    constructor(private readonly signInUseCase: SignInUseCase) {
        super();
    }
    protected override async handle({ body }: Controller.Request<"public", SignInBody>): Promise<Controller.Response<SignInController.Response>> {
        const { email, password } = body
        const { accessToken, refreshToken } = await this.signInUseCase.execute({ email, password });
        return {
            statusCode: 200,
            body: { accessToken, refreshToken }
        };
    }
}


export namespace SignInController {
    export type Response = {
        accessToken: string;
        refreshToken: string;
    };
}
