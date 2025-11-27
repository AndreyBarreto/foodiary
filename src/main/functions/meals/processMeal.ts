import "reflect-metadata";
import { Registry } from "@kernel/di/Registry";
import { MealsQueueConsumer } from "@application/queues/MealsQueueConsumer";
import { lambdaSQSAdapter } from "@main/adapters/lambdaSQSAdapter";

const consumer = Registry.getInstance().resolve(MealsQueueConsumer)

export const handler = lambdaSQSAdapter(consumer)
