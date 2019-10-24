import { HttpService, Logger, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AmqpModule } from "../amqp/amqp.module";
import { AmqpService } from "../amqp/services/amqp.service";
import { AirwatchAuthModule } from "../auth/airwatch.auth.module";
import { AirwatchHttpModule } from "../http/http.module";
import { PushToken } from "./entities/push-token.entity";
import { IPushMessage } from "./interfaces/push-message.interface";
import { IPushServiceFactory } from "./interfaces/push.service.factory.interface";
import { IPushService } from "./interfaces/push.service.interface";
import { PushTokenController } from "./push-token.controller";
import { AirwatchPushService } from "./services/airwatch-push.service";
import { FirebasePushService } from "./services/firebase-push.service";
import { PushTokenService } from "./services/push-token.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([PushToken]),
        AirwatchHttpModule,
        AmqpModule,
        AirwatchAuthModule,
    ],
    controllers: [PushTokenController],
    providers: [PushTokenService],
    exports: [PushTokenService],
})
export class PushTokenModule implements IPushServiceFactory {
    private readonly logger = new Logger(PushTokenModule.name);
    private readonly client = this.createPushClient();

    constructor(
        private readonly amqpService: AmqpService,
        private readonly httpService: HttpService,
    ) {
        if (process.env.NODE_ENV === "testing") {
            return;
        }
        this.consumePushNotifications().catch(this.logger.error);
    }

    private async consumePushNotifications() {
        const channel = await this.amqpService.getAssertedChannelFor(AmqpService.PUSH_NOTIFICATION);
        await channel.consume(AmqpService.PUSH_NOTIFICATION, async message => {
            const body = await this.amqpService.decodeMessageContent<IPushMessage>(message);
            if (body.token && body.message) {
                try {
                    await this.client.sendToDevice(body.token, body.message, body.options);
                    const safeToLogToken =
                        body.token.slice(0, 8) +
                        "..." +
                        body.token.slice(body.token.length - 8 - 1, body.token.length - 1);
                    this.logger.debug(`Push notification to "${safeToLogToken}" successfully sent`);
                } catch (error) {
                    this.logger.error(`Cannot send push to "${body.token}": ${error.message}`);
                }
            }
            channel.ack(message);
        });
    }

    createPushClient(): IPushService {
        if (process.env.PUSH_CLIENT === "firebase") {
            return new FirebasePushService();
        } else if (process.env.PUSH_CLIENT === "airwatch") {
            return new AirwatchPushService(this.httpService);
        } else if (process.env.NODE_ENV === "testing") {
            // stub service
            return new (class implements IPushService {
                async sendToDevice(
                    deviceId: string,
                    message: string,
                    options: object,
                ): Promise<void> {}
            })();
        }
        throw new Error("Not supported push client type");
    }
}
