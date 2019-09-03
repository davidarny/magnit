import { Channel, ConsumeMessage } from "amqplib";

export interface IAmqpService {
    closeConnection(): Promise<void>;

    getAssertedChannelFor(queue: string): Promise<Channel>;

    decodeMessageContent<T>(message: ConsumeMessage): Partial<T> | undefined;
}
