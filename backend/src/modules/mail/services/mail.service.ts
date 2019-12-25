import { ISendMailOptions, MailerService } from "@nest-modules/mailer";
import { Injectable } from "@nestjs/common";

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}

    async send(options: ISendMailOptions): Promise<void> {
        return this.mailerService.sendMail(options);
    }
}
