import { Controller } from "../../contracts/Controller";
import { Injectable } from "@kernel/decorators/Injectable";
import { Schema } from "@kernel/decorators/Schema";
import { UpdateGoalBody, updateGoalSchema } from "./schemas/updateGoalSchema";
import { UpdateGoalUseCase } from "@application/usecases/goals/UpdateGoalUseCase";

@Injectable()
@Schema(updateGoalSchema)
export class UpdateGoalController extends Controller<"private", UpdateGoalController.Response> {
    constructor(private readonly updateGoalUseCase: UpdateGoalUseCase) {
        super();
    }

    protected override async handle({ accountId, body }: Controller.Request<"private", UpdateGoalBody>): Promise<Controller.Response<UpdateGoalController.Response>> {

        await this.updateGoalUseCase.execute({ accountId, ...body.goal });


        return {
            statusCode: 204,
        };
    }
}


export namespace UpdateGoalController {
    export type Response = void
}
