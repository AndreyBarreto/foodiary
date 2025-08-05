import { Injectable } from "@kernel/decorators/Injectable";

type CompensationFn = () => Promise<void>;

@Injectable()
export class Saga {
    private compensations: (CompensationFn)[] = [];

    addCompensation(fn: CompensationFn): void {
        this.compensations.unshift(fn);
    }
    async compensate() {
        for await (const compensation of this.compensations) {
            try {
                await compensation();
            } catch (error) {
                console.error(error);
            }
        }
    }

    async run<TResult>(fn: () => Promise<TResult>) {
        try {
            return await fn();
        } catch (error) {
            await this.compensate();
            throw error;

        }
    }
}
