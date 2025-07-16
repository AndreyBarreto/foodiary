import { ErrorCode } from "../ErrorCode";
import { HttpError } from "./HttpError";

export class BadRequest extends HttpError {
    public override statusCode = 400;
    public override code = ErrorCode.BAD_REQUEST;

    constructor(message: string) {
        super(message);
        this.name = "BadRequest";
        this.code = ErrorCode.BAD_REQUEST;
        this.message = message ?? "Bad Request";
    }
}
