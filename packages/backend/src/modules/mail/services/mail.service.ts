import { ISendMailOptions, MailerService } from "@nest-modules/mailer";
import { Injectable } from "@nestjs/common";
import { IMailService } from "../interfaces/mail.service.interface";

@Injectable()
export class MailService implements IMailService {
    constructor(private readonly mailerService: MailerService) {}

    async send(options: ISendMailOptions): Promise<void> {
        return this.mailerService.sendMail(options);
    }
}
