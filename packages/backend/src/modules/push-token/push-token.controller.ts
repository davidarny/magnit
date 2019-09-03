import { Body, Controller, Inject, Post, Req } from "@nestjs/common";
import { ApiImplicitBody, ApiOkResponse, ApiUseTags } from "@nestjs/swagger";
import { IAuthRequest } from "../../shared/interfaces/auth.request.interface";
import { BaseResponse } from "../../shared/responses/base.response";
import { IAmqpService } from "../amqp/interfaces/amqp.service.interface";
import { AmqpService } from "../amqp/services/amqp.service";
import { MessagePayloadDto } from "./dto/message-payload.dto";
import { PushToken } from "./entities/push-token.entity";
import { IPushMessage } from "./interfaces/push-message.interface";
import { IPushTokenService } from "./interfaces/push-token.service.interface";
import { PushTokenService } from "./services/push-token.service";

@ApiUseTags("push_token")
@Controller("push_token")
export class PushTokenController {
    constructor(
        @Inject(PushTokenService) private readonly pushTokenService: IPushTokenService,
        @Inject(AmqpService) private readonly amqpService: IAmqpService,
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
    async send(@Body() payload: MessagePayloadDto, @Req() req: IAuthRequest) {
        const channel = await this.amqpService.getAssertedChannelFor(AmqpService.PUSH_NOTIFICATION);
        await channel.sendToQueue(
            AmqpService.PUSH_NOTIFICATION,
            Buffer.from(
                JSON.stringify({
                    token: req.user.token,
                    message: payload,
                } as IPushMessage),
            ),
        );
        return { success: 1 };
    }
}
