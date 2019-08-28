import { Channel } from "amqplib";

export interface IAmqpService {
    close(): Promise<void>;

    createChannel(): Promise<Channel>;
}
