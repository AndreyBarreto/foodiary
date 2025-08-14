import { Controller } from "../../contracts/Controller";
import { Injectable } from "@kernel/decorators/Injectable";
import { CreateMealUseCase } from "@application/usecases/meals/CreateMealUseCase";
import { createMealSchema } from "./schemas/createMealSchema";
import { Schema } from "@kernel/decorators/Schema";
import { Meal } from "@application/entities/Meal";
import { CreateMealBody } from './schemas/createMealSchema';

@Injectable()
@Schema(createMealSchema)
export class CreateMealController extends Controller<"private", CreateMealController.Response> {
    constructor(private readonly createMealUseCase: CreateMealUseCase) {
        super();
    }

    protected override async handle({ accountId, body }: Controller.Request<"private", CreateMealBody>): Promise<Controller.Response<CreateMealController.Response>> {

        const { file } = body;
        const inputType = file.type === "audio/m4a" ? Meal.InputType.AUDIO : Meal.InputType.PICTURE;

        const { mealId, uploadSignature } = await this.createMealUseCase.execute({ accountId, file: { type: inputType, size: file.size } });

        return {
            statusCode: 201,
            body: {
                mealId,
                uploadSignature,
            }
        };
    }
}


export namespace CreateMealController {
    export type Response = {
        mealId: string;
        uploadSignature: string;
    };
}
