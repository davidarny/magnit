import { ISendMailOptions } from "@nest-modules/mailer";

export interface IMailService {
    send(options: ISendMailOptions): Promise<void>;
}
