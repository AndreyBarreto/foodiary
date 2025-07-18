import KSUID from "ksuid";
import { Controller } from "../../contracts/Controller";
import { Injectable } from "@kernel/decorators/Injectable";



@Injectable()
export class CreateMealController extends Controller<undefined, CreateMealController.Response> {
    protected override async handle(): Promise<Controller.Response<CreateMealController.Response>> {
        return {
            statusCode: 201,
            body: { mealId: KSUID.randomSync().string }
        };
    }
}


export namespace CreateMealController {
    export type Response = {
        mealId: string;
    };
}
