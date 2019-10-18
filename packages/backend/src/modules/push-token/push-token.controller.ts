import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiImplicitBody, ApiOkResponse, ApiUseTags } from "@nestjs/swagger";
import { CannotSendPushNotificationException } from "../../shared/exceptions/cannot-send-push-notification.exception";
import { IAuthRequest } from "../../shared/interfaces/auth.request.interface";
import { BaseResponse } from "../../shared/responses/base.response";
import { AmqpService } from "../amqp/services/amqp.service";
import { AirwatchAuthGuard } from "../auth/guards/airwatch.auth.guard";
import { MessagePayloadDto } from "./dto/message-payload.dto";
import { PushToken } from "./entities/push-token.entity";
import { IPushMessage } from "./interfaces/push-message.interface";
import { PushTokenService } from "./services/push-token.service";

@ApiBearerAuth()
@UseGuards(AirwatchAuthGuard)
@ApiUseTags("push_token")
@Controller("push_token")
export class PushTokenController {
    constructor(
        private readonly pushTokenService: PushTokenService,
        private readonly amqpService: AmqpService,
    ) {}

    @Post("/")
    @ApiImplicitBody({ name: "token", type: String })
    @ApiOkResponse({ type: BaseResponse })
    async create(@Body("token") token: string, @Req() req: IAuthRequest) {
        const pushToken = new PushToken({ token, id_user: req.user.id });
        await this.pushTokenService.createUniqueToken(pushToken);
        return { success: 1 };
    }

    @Post("/send")
    @ApiOkResponse({ type: BaseResponse })
    async send(@Body() messagePayloadDto: MessagePayloadDto, @Req() req: IAuthRequest) {
        const channel = await this.amqpService.getAssertedChannelFor(AmqpService.PUSH_NOTIFICATION);
        if (!req.user.tokens) {
            throw new CannotSendPushNotificationException("User has no push tokens");
        }
        await Promise.all(
            req.user.tokens.map(async token => {
                const pushMessage: IPushMessage = {
                    token,
                    message: messagePayloadDto,
                };
                await channel.sendToQueue(
                    AmqpService.PUSH_NOTIFICATION,
                    Buffer.from(JSON.stringify(pushMessage)),
                );
            }),
        );
        return { success: 1 };
    }
}
