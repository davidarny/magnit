import { ApiModelProperty } from "@nestjs/swagger";
import { TTaskStatus } from "../entities/task.entity";

export class FindAllQuery {
    @ApiModelProperty({ default: 0, required: false, minimum: 0 }) readonly offset: number = 0;
    @ApiModelProperty({ default: 10, required: false, minimum: 0 }) readonly limit: number = 10;
    @ApiModelProperty({ default: "ASC", required: false, enum: ["ASC", "DESC"] })
    readonly sort: "ASC" | "DESC" = "ASC";
    @ApiModelProperty({
        required: false,
        enum: ["in_progress", "on_check", "draft", "completed"],
        description: "Query by status",
    })
    readonly status?: TTaskStatus;
    @ApiModelProperty({
        type: [String],
        required: false,
        enum: ["in_progress", "on_check", "draft", "completed"],
        description: 'Query by multiple status (e.g. ["in_progress", "completed"]',
    })
    readonly statuses?: TTaskStatus[];
    @ApiModelProperty({ required: false, description: "Query by name" })
    readonly name?: string;
}
