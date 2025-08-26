import { Controller } from "../../contracts/Controller";
import { Injectable } from "@kernel/decorators/Injectable";
import { GetMealByIdUseCase } from "@application/usecases/meals/GetMealByIdUseCase";
import { Meal } from "@application/entities/Meal";

@Injectable()
export class GetMealByIdController extends Controller<"private", GetMealByIdController.Response> {
    constructor(private readonly getMealByIdUseCase: GetMealByIdUseCase) {
        super();
    }

    protected override async handle({ accountId, params }: Controller.Request<"private", any, GetMealByIdController.Params>): Promise<Controller.Response<GetMealByIdController.Response>> {

        const { mealId } = params;

        const meal = await this.getMealByIdUseCase.execute({ accountId, mealId });

        return {
            statusCode: 200,
            body: {
                meal: {
                    id: meal.meal.id,
                    status: meal.meal.status,
                    inputType: meal.meal.inputType,
                    inputFileURL: meal.meal.inputFileURL,
                    name: meal.meal.name,
                    icon: meal.meal.icon,
                    foods: meal.meal.foods,
                    createdAt: meal.meal.createdAt,
                },
            }
        };
    }
}


export namespace GetMealByIdController {
    export type Params = {
        mealId: string;
    };
    export type Response = {
        meal: {
            id: string;
            status: Meal.Status;
            inputType: Meal.InputType;
            inputFileURL: string;
            name: string;
            icon: string;
            foods: Meal.Food[];
            createdAt: string;
        };
    };
}
