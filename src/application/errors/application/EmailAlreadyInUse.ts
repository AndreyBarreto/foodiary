import { ErrorCode } from "../ErrorCode";
import { ApplicationError } from "./ApplicationError";

export class EmailAlreadyInUse extends ApplicationError {
    public override code = ErrorCode.EMAIL_ALREADY_IN_USE;

    constructor() {
        super();

        this.name = "EmailAlreadyInUse";
        this.message = "This email is already in use";
    }
}
