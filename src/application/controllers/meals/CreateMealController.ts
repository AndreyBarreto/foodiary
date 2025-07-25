import KSUID from "ksuid";
import { Controller } from "../../contracts/Controller";
import { Injectable } from "@kernel/decorators/Injectable";



@Injectable()
export class CreateMealController extends Controller<"private", CreateMealController.Response> {
    protected override async handle({ accountId }: Controller.Request<"private">): Promise<Controller.Response<CreateMealController.Response>> {
        return {
            statusCode: 201,
            body: {
                mealId: KSUID.randomSync().string,
                accountId,
            }
        };
    }
}


export namespace CreateMealController {
    export type Response = {
        mealId: string;
        accountId: string;
    };
}
