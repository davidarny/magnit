import { HttpService } from "@nestjs/common";
import { IPushService } from "../interfaces/push.service.interface";

export class AirwatchPushService implements IPushService {
    constructor(private readonly httpService: HttpService) {
        if (!process.env.AIRWATCH_APP_NAME) {
            throw new Error(`Cannot initialize ${AirwatchPushService.name} without app name`);
        }
    }

    async sendToDevice(deviceId: string, message: string, options: object): Promise<void> {
        await this.httpService
            .post(`mdm/devices/messages/message?searchby=DeviceId&id=${deviceId}`, {
                MessageBody: message,
                ApplicationName: process.env.AIRWATCH_APP_NAME,
            })
            .toPromise();
    }
}
