import { getSchema } from "@kernel/decorators/Schema";
export abstract class Controller<TRequest = undefined, TResponse = undefined> {

    protected abstract handle(request: Controller.Request<TRequest>): Promise<Controller.Response<TResponse>>;

    public execute(request: Controller.Request<TRequest>): Promise<Controller.Response<TResponse>> {
        const body = this.validateBody(request.body);
        return this.handle({ ...request, body });
    }

    private validateBody(body: Controller.Request<TRequest>["body"]) {
        const schema = getSchema(this);
        if (!schema) {
            return body;
        }
        return schema.parse(body);
    }
}
export namespace Controller {
    export type Request<Tbody = Record<string, unknown>, Tparams = Record<string, unknown>, TqueryParams = Record<string, unknown>> = {
        body: Tbody;
        params: Tparams;
        queryParams: TqueryParams;

    }
    export type Response<Tbody = undefined> = {
        statusCode: number;
        body?: Tbody;
    }
}
