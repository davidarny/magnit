import { Channel } from "amqplib";

export interface IAmqpService {
    closeConnection(): Promise<void>;

    createChannel(): Promise<Channel>;
}
