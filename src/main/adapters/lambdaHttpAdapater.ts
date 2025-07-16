import { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { lambdaBodyParser } from "@main/utils/lambdaBodyParser";
import { Controller } from "@application/contracts/Controller";
import { ZodError } from "zod";
import { ErrorCode } from "@application/errors/ErrorCode";
import { lambdaErrorResponse } from "@main/utils/lambdaErrorResponse";
import { HttpError } from "@application/errors/http/HttpError";

export function lambdaHttpAdapter(controller: Controller<unknown, unknown>) {
    return async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
        try {
            const params = event.pathParameters ?? {};
            const queryParams = event.queryStringParameters ?? {};
            const body = lambdaBodyParser(event.body);

            const response = await controller.execute({
                params,
                queryParams,
                body,
            });

            return {
                statusCode: response.statusCode,
                body: response.body ? JSON.stringify(response.body) : undefined,
            };

        } catch (error) {
            if (error instanceof ZodError) {
                return lambdaErrorResponse({
                    code: ErrorCode.VALIDATION_ERROR,
                    message: error.issues.map((issue) => ({ field: issue.path.join("."), message: issue.message })),
                    statusCode: 400,
                });
            }
            if (error instanceof HttpError) {
                return lambdaErrorResponse(error);
            }
            console.error(error)
            return lambdaErrorResponse({
                code: ErrorCode.INTERNAL_SERVER_ERROR,
                message: "Internal server error",
                statusCode: 500,
            });
        }
    };
}
