import { Controller } from "../../contracts/Controller";
import { Injectable } from "@kernel/decorators/Injectable";
import { UpdateProfileUseCase } from "@application/usecases/profiles/UpdateProfileUseCase";
import { UpdateProfileBody, updateProfileSchema } from "./schemas/updateProfileSchema";
import { Schema } from "@kernel/decorators/Schema";

@Injectable()
@Schema(updateProfileSchema)
export class UpdateProfileController extends Controller<"private", UpdateProfileController.Response> {
    constructor(private readonly updateProfileUseCase: UpdateProfileUseCase) {
        super();
    }

    protected override async handle({ accountId, body }: Controller.Request<"private", UpdateProfileBody>): Promise<Controller.Response<UpdateProfileController.Response>> {

        await this.updateProfileUseCase.execute({ accountId, ...body.profile });


        return {
            statusCode: 204,
        };
    }
}


export namespace UpdateProfileController {
    export type Response = void
}
