import { Controller } from "../../contracts/Controller";
import { Injectable } from "@kernel/decorators/Injectable";
import { ListMealsByDayQuery } from "@application/query/ListMealsByDayQuery";
import { Meal } from "@application/entities/Meal";
import { listMealsByDaySchema } from "./schemas/listMealsByDaySchema";
import { CreateMealBody } from "./schemas/createMealSchema";

@Injectable()
export class ListMealsByDayController extends Controller<"private", ListMealsByDayController.Response> {
    constructor(private readonly listMealsByDayQuery: ListMealsByDayQuery) {
        super();
    }

    protected override async handle({ accountId, queryParams }: Controller.Request<"private", CreateMealBody>): Promise<Controller.Response<ListMealsByDayController.Response>> {

        const { date } = listMealsByDaySchema.parse(queryParams);

        const { meals } = await this.listMealsByDayQuery.execute({ accountId, date });

        return {
            statusCode: 201,
            body: {
                meals,
            }
        };
    }
}


export namespace ListMealsByDayController {
    export type Response = {
        meals: {
            id: string,
            createdAt: string,
            name: string,
            icon: string,
            foods: Meal.Food[]
        }[]
    }
}
