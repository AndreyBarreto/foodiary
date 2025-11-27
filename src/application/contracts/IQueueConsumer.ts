export interface IQueueConsumer<Tmessage extends Record<string, unknown>> {
    process(message: Tmessage): Promise<void>;
}
