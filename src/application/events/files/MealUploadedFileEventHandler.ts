import { IFileEventHandler } from "@application/contracts/IFileEventHandler";
import { MealUploadedUseCase } from "@application/usecases/meals/MealUploadedUseCase";
import { Injectable } from "@kernel/decorators/Injectable";

@Injectable()
export class MealUploadedFileEventHandler implements IFileEventHandler {
    constructor(private readonly mealUploadedUseCase: MealUploadedUseCase) { }

    async handle({ fileKey }: IFileEventHandler.Input): Promise<void> {
        console.log("handling meal uploaded file event: ", { fileKey });
        await this.mealUploadedUseCase.execute({ fileKey });
        console.log("meal uploaded file event handled successfully: ", { fileKey });
    }
}
