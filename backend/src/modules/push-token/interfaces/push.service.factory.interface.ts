import { IPushService } from "./push.service.interface";

export interface IPushServiceFactory {
    createPushClient(): IPushService;
}
