import { ApiModelProperty } from "@nestjs/swagger";
import { BaseResponse } from "../../../shared/responses/base.response";
import { User } from "../entities/user.entity";

export class GetAllUsersResponse extends BaseResponse {
    @ApiModelProperty({ type: [User] }) readonly users: User[];
}
