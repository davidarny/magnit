import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Query,
    Req,
    Res,
    UploadedFiles,
    UseInterceptors,
    UsePipes,
} from "@nestjs/common";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import {
    ApiBadRequestResponse,
    ApiBearerAuth,
    ApiConsumes,
    ApiCreatedResponse,
    ApiImplicitBody,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiProduces,
    ApiUseTags,
} from "@nestjs/swagger";
import { Response } from "express";
import * as _ from "lodash";
import { IAuthRequest } from "../../shared/interfaces/auth.request.interface";
import { NonCompatiblePropsPipe } from "../../shared/pipes/non-compatible-props.pipe";
import { NumericIdPipe } from "../../shared/pipes/numeric-id.pipe";
import { SplitPropPipe } from "../../shared/pipes/split-prop.pipe";
import { BaseResponse } from "../../shared/responses/base.response";
import { ErrorResponse } from "../../shared/responses/error.response";
import { AmqpService } from "../amqp/services/amqp.service";
import { IMailMessage } from "../mail/interfaces/mail-message.interface";
import { IScheduleMessage } from "../mail/interfaces/schedule-message.interface";
import { TemplateByIdPipe } from "../template/pipes/template-by-id.pipe";
import { TemplateService } from "../template/services/template.service";
import { AddTemplatesDto } from "./dto/add-templates.dto";
import { TaskStageDto } from "./dto/task-stage.dto";
import { TaskDto } from "./dto/task.dto";
import { TemplateAssignmentDto } from "./dto/template-assignment.dto";
import { TaskDocument } from "./entities/task-document.entity";
import { TaskStage } from "./entities/task-stage.entity";
import { Task } from "./entities/task.entity";
import { CommentByIdPipe } from "./pipes/comment-by-id.pipe";
import { DocumentByIdPipe } from "./pipes/document-by-id.pipe";
import { TaskByIdPipe } from "./pipes/task-by-id.pipe";
import { TaskExpiredPipe } from "./pipes/task-expired.pipe";
import { TemplatesByIdsPipe } from "./pipes/templates-by-ids.pipe";
import { FindAllQueryExtended } from "./queries/find-all-extended.query";
import { FindAllQuery } from "./queries/find-all.query";
import { CreateTaskResponse } from "./responses/create-task.response";
import { GetReportResponse } from "./responses/get-report.response";
import { GetStagesWithFullHistoryResponse } from "./responses/get-stages-with-full-history.response";
import { GetTaskExtendedResponse } from "./responses/get-task-extended.response";
import { GetTaskResponse } from "./responses/get-task.response";
import { GetTasksExtendedResponse } from "./responses/get-tasks-extended.response";
import { GetTasksResponse } from "./responses/get-tasks.response";
import { TaskService } from "./services/task.service";

@ApiUseTags("tasks")
@ApiBearerAuth()
@Controller("tasks")
export class TaskController {
    constructor(
        private readonly taskService: TaskService,
        private readonly templateService: TemplateService,
        private readonly amqpService: AmqpService,
    ) {}

    @Get("/")
    @UsePipes(TaskExpiredPipe)
    @ApiOkResponse({ type: GetTasksResponse, description: "Get all Tasks" })
    @ApiBadRequestResponse({ description: "Found non compatible props" })
    async findAll(
        @Query(
            new NonCompatiblePropsPipe<FindAllQuery>(["status", "statuses"]),
            new SplitPropPipe<FindAllQuery>("statuses"),
        )
        query?: FindAllQuery,
    ) {
        const { offset, limit, sortBy, sort, statuses, status, title } = {
            // need this to correctly handle default values
            // not sure if nest creates them on given query
            ...new FindAllQuery(),
            ...query,
        };
        const tasks = await this.taskService.findAll(
            offset,
            limit,
            sortBy,
            sort,
            status,
            statuses,
            title,
        );
        return { success: 1, total: tasks.length, tasks };
    }

    @Get("/extended")
    @UsePipes(TaskExpiredPipe)
    @ApiOkResponse({
        type: GetTasksExtendedResponse,
        description: "Get Tasks with Marketplace & last Stage",
    })
    @ApiBadRequestResponse({ description: "Found non compatible props" })
    async findAllExtended(
        @Query(
            new NonCompatiblePropsPipe<FindAllQueryExtended>(["status", "statuses"]),
            new SplitPropPipe<FindAllQueryExtended>("statuses"),
        )
        query?: FindAllQueryExtended,
    ) {
        const { offset, limit, sortBy, sort, statuses, status, title, city, region } = {
            // need this to correctly handle default values
            // not sure if nest creates them on given query
            ...new FindAllQueryExtended(),
            ...query,
        };
        const tasks = await this.taskService.findAllExtended(
            offset,
            limit,
            sortBy,
            sort,
            status,
            statuses,
            title,
            region,
            city,
        );
        return { success: 1, total: tasks.length, tasks };
    }

    @Post("/")
    @ApiImplicitBody({ name: "task", type: TaskDto, description: "Task JSON" })
    @ApiCreatedResponse({ type: CreateTaskResponse, description: "ID of created Task" })
    async create(@Body("task") taskDto: TaskDto) {
        const task = new Task(taskDto);
        const id = await this.taskService.insert(task);
        return { success: 1, task_id: id };
    }

    @Put("/:id")
    @ApiImplicitBody({ name: "task", type: TaskDto, description: "Task JSON" })
    @ApiOkResponse({ type: BaseResponse })
    @ApiNotFoundResponse({ type: ErrorResponse, description: "Task not found" })
    async update(
        @Param("id", NumericIdPipe, TaskByIdPipe) id: number,
        @Body("task") taskDto: TaskDto,
    ) {
        await this.taskService.update(id, taskDto);
        return { success: 1 };
    }

    @Get("/:id")
    @ApiOkResponse({ type: GetTaskResponse, description: "Task JSON" })
    @ApiNotFoundResponse({ type: ErrorResponse, description: "Task not found" })
    async findById(@Param("id", NumericIdPipe, TaskByIdPipe, TaskExpiredPipe) id: number) {
        const task = await this.taskService.findByIdWithTemplatesAndStages(id);
        return { success: 1, task };
    }

    @Post("/:id/templates")
    @ApiImplicitBody({
        name: "templates",
        type: AddTemplatesDto,
        description: "IDs of Templates to add",
    })
    @ApiOkResponse({ type: BaseResponse })
    @ApiNotFoundResponse({ type: ErrorResponse, description: "Template not found" })
    @ApiNotFoundResponse({ type: ErrorResponse, description: "Task not found" })
    async setTemplateAssignments(
        @Param("id", NumericIdPipe, TaskByIdPipe) taskId: number,
        @Body("templates", NumericIdPipe, TemplatesByIdsPipe) templateIds: number[],
    ) {
        await this.taskService.setTemplateAssignments(taskId, templateIds);
        return { success: 1 };
    }

    @Put("/:task_id/templates/:template_id")
    @ApiOkResponse({ type: BaseResponse })
    @ApiNotFoundResponse({ type: ErrorResponse, description: "Template not found" })
    @ApiNotFoundResponse({ type: ErrorResponse, description: "Task not found" })
    async updateTemplateAssignment(
        @Param("task_id", NumericIdPipe, TaskByIdPipe) taskId: number,
        @Param("template_id", NumericIdPipe, TemplateByIdPipe) templateId: number,
        @Body() templateAssignmentDto: TemplateAssignmentDto,
    ) {
        await this.taskService.updateTemplateAssignment(taskId, templateId, templateAssignmentDto);
        return { success: 1 };
    }

    @Post("/:id/stages")
    @ApiImplicitBody({ type: [TaskStageDto], name: "stages" })
    @ApiOkResponse({ type: BaseResponse })
    @ApiNotFoundResponse({ type: ErrorResponse, description: "Task not found" })
    async addTaskStages(
        @Param("id", NumericIdPipe, TaskByIdPipe) id: number,
        @Body("stages") stageDtoArray: TaskStageDto[],
    ) {
        const task = await this.taskService.findById(id, ["stages"]);
        task.stages = [
            ...task.stages,
            // create stages from dto array
            ...stageDtoArray.map(taskStageDto => new TaskStage({ ...taskStageDto })),
        ];
        await this.taskService.update(id, task);
        return { success: 1 };
    }

    @Delete("/:id")
    @ApiOkResponse({ type: BaseResponse, description: "OK response" })
    @ApiNotFoundResponse({ type: ErrorResponse, description: "Task not found" })
    async deleteById(@Param("id", NumericIdPipe, TaskByIdPipe) id: number) {
        await this.taskService.deleteById(id);
        return { success: 1 };
    }

    @Get("/:id/extended")
    @ApiOkResponse({ type: GetTaskExtendedResponse, description: "Extended Task JSON" })
    @ApiNotFoundResponse({ type: ErrorResponse, description: "Task not found" })
    async findByIdExtended(@Param("id", NumericIdPipe, TaskByIdPipe, TaskExpiredPipe) id: number) {
        const task = await this.taskService.getTaskExtended(id);
        return { success: 1, task };
    }

    @Get("/:id/stages/history/full")
    @ApiOkResponse({
        type: GetStagesWithFullHistoryResponse,
        description: "Task Stages with history",
    })
    @ApiNotFoundResponse({ type: ErrorResponse, description: "Task not found" })
    async getStagesWithFullHistory(
        @Param("id", NumericIdPipe, TaskByIdPipe, TaskExpiredPipe) id: number,
    ) {
        const task = await this.taskService.getTaskStagesWithHistory(id);
        return { success: 1, stages: task.stages };
    }

    @Get("/:id/report")
    @ApiOkResponse({ type: GetReportResponse, description: "Task report" })
    @ApiNotFoundResponse({ type: ErrorResponse, description: "Task not found" })
    async getReport(@Param("id", NumericIdPipe, TaskByIdPipe, TaskExpiredPipe) id: number) {
        const [, report] = await this.taskService.getReport(id);
        return { success: 1, report };
    }

    @Post("/:id/answers")
    @ApiConsumes("multipart/form-data")
    @ApiOkResponse({ type: BaseResponse })
    @ApiNotFoundResponse({ type: ErrorResponse, description: "Task not found" })
    @ApiNotFoundResponse({ type: ErrorResponse, description: "Template not found" })
    @ApiNotFoundResponse({ type: ErrorResponse, description: "Puzzle not found" })
    @UseInterceptors(AnyFilesInterceptor())
    async setTaskAnswers(
        @Param("id", NumericIdPipe, TaskByIdPipe) id: number,
        @UploadedFiles() files: Express.Multer.File[],
        @Body() body: { [key: string]: string },
    ) {
        const templateIds = [
            ...(files || []).map(file => file.fieldname),
            ...Object.keys(body),
        ].filter(key => key !== "location");
        await this.taskService.setTaskAnswers(id, templateIds, files, body);
        return { success: 1 };
    }

    @Get("/:id/report/file")
    @ApiOkResponse({ description: "XLSX file reposnse" })
    @ApiNotFoundResponse({ type: ErrorResponse, description: "Task not found" })
    @ApiProduces("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    async getReportFile(
        @Param("id", NumericIdPipe, TaskByIdPipe, TaskExpiredPipe) id: number,
        @Res() res: Response,
    ) {
        const [, report] = await this.taskService.getReport(id);
        const buffer = this.taskService.getReportBuffer(report);
        res.type("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.attachment("report.xlsx");
        res.status(200).send(buffer);
    }

    @Get("/:id/report/email/:email")
    @ApiOkResponse({ type: BaseResponse })
    @ApiNotFoundResponse({ type: ErrorResponse, description: "Task not found" })
    async getReportByEmail(
        @Param("id", NumericIdPipe, TaskByIdPipe, TaskExpiredPipe) id: number,
        @Param("email") email: string,
    ) {
        const [task, report] = await this.taskService.getReport(id);
        const buffer = this.taskService.getReportBuffer(report);
        const channel = await this.amqpService.getAssertedChannelFor(AmqpService.EMAIL_QUEUE);
        const mailMessage: IMailMessage = {
            email,
            buffer,
            subject: `Отчёт по заданию "${task.title}"`,
            filename: "report.xlsx",
        };
        await channel.sendToQueue(
            AmqpService.EMAIL_QUEUE,
            Buffer.from(JSON.stringify(mailMessage)),
        );
        return { success: 1 };
    }

    @Put("/:id/report/email/:email/schedule/:schedule")
    @ApiOkResponse({ type: BaseResponse })
    @ApiNotFoundResponse({ type: ErrorResponse, description: "Task not found" })
    async scheduleReportByEmail(
        @Param("id", NumericIdPipe, TaskByIdPipe) id: number,
        @Param("schedule") schedule: string,
        @Param("email") email: string,
    ) {
        const channel = await this.amqpService.getAssertedChannelFor(
            AmqpService.SCHEDULE_EMAIL_QUEUE,
        );
        const scheduleMessage: IScheduleMessage = {
            email,
            id,
            schedule: `* 12 */${schedule} * *`,
        };
        await channel.sendToQueue(
            AmqpService.SCHEDULE_EMAIL_QUEUE,
            Buffer.from(JSON.stringify(scheduleMessage)),
        );
        return { success: 1 };
    }

    @Delete("/:id/report/schedule")
    @ApiOkResponse({ type: BaseResponse })
    @ApiNotFoundResponse({ type: ErrorResponse, description: "Task not found" })
    async cancelScheduledReport(@Param("id", NumericIdPipe, TaskByIdPipe) id: number) {
        const channel = await this.amqpService.getAssertedChannelFor(
            AmqpService.CANCEL_EMAIL_SCHEDULE,
        );
        await channel.sendToQueue(AmqpService.CANCEL_EMAIL_SCHEDULE, Buffer.from(id.toString()));
        return { success: 1 };
    }

    @Post("/:id/documents")
    @ApiConsumes("multipart/form-data")
    @ApiOkResponse({ type: BaseResponse })
    @ApiNotFoundResponse({ type: ErrorResponse, description: "Task not found" })
    @UseInterceptors(AnyFilesInterceptor())
    async addTaskDocument(
        @Param("id", NumericIdPipe, TaskByIdPipe) id: number,
        @UploadedFiles() files: Express.Multer.File[],
    ) {
        const file = _.first(files);
        if (!file) {
            throw new BadRequestException("No file found for document!");
        }
        const document = new TaskDocument({
            id_task: id,
            filename: file.filename,
            original_name: file.originalname,
        });
        await this.taskService.addTaskDocument(document);
        return { success: 1 };
    }

    @Delete("/:task_id/documents/:document_id")
    @ApiOkResponse({ type: BaseResponse })
    @ApiNotFoundResponse({ type: ErrorResponse, description: "Task not found" })
    @ApiNotFoundResponse({ type: ErrorResponse, description: "Document not found" })
    async deleteTaskDocument(
        @Param("task_id", NumericIdPipe, TaskByIdPipe) taskId: number,
        @Param("document_id", NumericIdPipe, DocumentByIdPipe) documentId: number,
    ) {
        await this.taskService.deleteDocumentById(taskId, documentId);
        return { success: 1 };
    }

    @Post("/:task_id/templates/:template_id/comments")
    @ApiOkResponse({ type: BaseResponse })
    @ApiImplicitBody({ name: "text", type: String })
    @ApiNotFoundResponse({ type: ErrorResponse, description: "Template not found" })
    @ApiNotFoundResponse({ type: ErrorResponse, description: "Task not found" })
    async addAssignmentComment(
        @Param("task_id", NumericIdPipe, TaskByIdPipe) taskId: number,
        @Param("template_id", NumericIdPipe, TemplateByIdPipe) templateId: number,
        @Req() req: IAuthRequest,
        @Body("text") text: string,
    ) {
        await this.taskService.addCommentToAssignment(taskId, templateId, req.user.id, text);
        return { success: 1 };
    }

    @Delete("/:task_id/comments/:comment_id")
    @ApiOkResponse({ type: BaseResponse })
    @ApiNotFoundResponse({ type: ErrorResponse, description: "Comment not found" })
    @ApiNotFoundResponse({ type: ErrorResponse, description: "Task not found" })
    async deleteAssignmentComment(
        @Param("comment_id", NumericIdPipe, CommentByIdPipe) commentId: number,
    ) {
        await this.taskService.removeAssignmentComment(commentId);
        return { success: 1 };
    }
}
