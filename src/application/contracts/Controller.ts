import { getSchema } from "@kernel/decorators/Schema";

type TRequestType = "public" | "private";

export abstract class Controller<TType extends TRequestType, TResponse = undefined> {

    protected abstract handle(request: Controller.Request<TType>): Promise<Controller.Response<TResponse>>;

    public execute(request: Controller.Request<TType>): Promise<Controller.Response<TResponse>> {
        const body = this.validateBody(request.body);
        return this.handle({ ...request, body });
    }

    private validateBody(body: Controller.Request<TType>["body"]) {
        const schema = getSchema(this);
        if (!schema) {
            return body;
        }
        return schema.parse(body);
    }
}
export namespace Controller {
    type BaseRequest<
        Tbody = Record<string, unknown>,
        Tparams = Record<string, unknown>,
        TqueryParams = Record<string, unknown>> = {
            body: Tbody;
            params: Tparams;
            queryParams: TqueryParams;
        }
    type PublicRequest<
        Tbody = Record<string, unknown>,
        Tparams = Record<string, unknown>,
        TqueryParams = Record<string, unknown>> =
        BaseRequest<Tbody, Tparams, TqueryParams> & {
            accountId: null;
        }

    type PrivateRequest<
        Tbody = Record<string, unknown>,
        Tparams = Record<string, unknown>,
        TqueryParams = Record<string, unknown>> =
        BaseRequest<Tbody, Tparams, TqueryParams> & {
            accountId: string;
        }

    export type Request<
        Ttype extends TRequestType,
        Tbody = Record<string, unknown>,
        Tparams = Record<string, unknown>,
        TqueryParams = Record<string, unknown>> =
        Ttype extends "public" ? PublicRequest<Tbody, Tparams, TqueryParams> : PrivateRequest<Tbody, Tparams, TqueryParams>;

    export type Response<
        Tbody = undefined> = {
            statusCode: number;
            body?: Tbody;
        }
}
