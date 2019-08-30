import { Body, Controller, Inject, Post, Req } from "@nestjs/common";
import { ApiImplicitBody, ApiOkResponse, ApiUseTags } from "@nestjs/swagger";
import { IAuthRequest } from "../../shared/interfaces/auth.request.interface";
import { BaseResponse } from "../../shared/responses/base.response";
import { PushToken } from "./entities/push-token.entity";
import { IPushTokenService } from "./interfaces/push-token.service.interface";
import { PushTokenService } from "./services/push-token.service";

@ApiUseTags("push_token")
@Controller("push_token")
export class PushTokenController {
    constructor(@Inject(PushTokenService) private readonly pushTokenService: IPushTokenService) {}

    @Post("/")
    @ApiImplicitBody({ name: "token", type: String })
    @ApiOkResponse({ type: BaseResponse })
    async create(@Body("token") token: string, @Req() req: IAuthRequest) {
        const pushToken = new PushToken({ token, id_user: req.user.id });
        await this.pushTokenService.createUniqueToken(pushToken);
        return { success: 1 };
    }
}
