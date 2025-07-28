import { ErrorCode } from "../ErrorCode";
import { ApplicationError } from "./ApplicationError";

export class InvalidRefreshToken extends ApplicationError {
    public override code = ErrorCode.INVALID_REFRESH_TOKEN;

    constructor() {
        super();

        this.name = "InvalidRefreshToken";
        this.message = "Invalid refresh token";
    }
}
