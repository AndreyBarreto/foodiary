import { Controller } from "../../contracts/Controller";
import { Schema } from "@kernel/decorators/Schema";
import { Injectable } from "@kernel/decorators/Injectable";
import { RefreshTokenBody, refreshTokenSchema } from "./schemas/refreshTokenSchema";
import { RefreshTokenUseCase } from "@application/usecases/auth/RefreshTokenUseCase";
import { InvalidRefreshToken } from "@application/errors/application/InvalidRefreshToken";



@Injectable()
@Schema(refreshTokenSchema)
export class RefreshTokenController extends Controller<"public", RefreshTokenController.Response> {
    constructor(private readonly refreshTokenUseCase: RefreshTokenUseCase) {
        super();
    }
    protected override async handle({ body }: Controller.Request<"public", RefreshTokenBody>): Promise<Controller.Response<RefreshTokenController.Response>> {
        try {
            const { refreshToken } = body
            const { accessToken, refreshToken: newRefreshToken } = await this.refreshTokenUseCase.execute({ refreshToken });
            return {
                statusCode: 200,
                body: { accessToken, refreshToken: newRefreshToken }
            };
        } catch (error) {
            if (error instanceof InvalidRefreshToken) {
                throw new InvalidRefreshToken()
            }
            throw error;
        }
    }
}


export namespace RefreshTokenController {
    export type Response = {
        accessToken: string;
        refreshToken: string;
    };
}
