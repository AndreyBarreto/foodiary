import { ErrorCode } from "../ErrorCode";
import { ApplicationError } from "./ApplicationError";

export class ResourceNotFound extends ApplicationError {
    public override code = ErrorCode.RESOURCE_NOT_FOUND;

    constructor(message?: string) {
        super();

        this.name = "ResourceNotFound";
        this.message = message ?? "Resource not found";
    }
}
