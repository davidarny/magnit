import {
    Body,
    Controller,
    Delete,
    Get,
    Inject,
    Param,
    Post,
    Put,
    Query,
    Res,
    UploadedFiles,
    UseInterceptors,
} from "@nestjs/common";
import { AnyFilesInterceptor } from "@nestjs/platform-express";
import {
    ApiBadRequestResponse,
    ApiConsumes,
    ApiCreatedResponse,
    ApiImplicitBody,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiProduces,
    ApiUseTags,
} from "@nestjs/swagger";
import { Response } from "express";
import { NonCompatiblePropsPipe } from "../../shared/pipes/non-compatible-props.pipe";
import { SplitPropPipe } from "../../shared/pipes/split-prop.pipe";
import { BaseResponse } from "../../shared/responses/base.response";
import { ErrorResponse } from "../../shared/responses/error.response";
import { IAmqpService } from "../amqp/interfaces/amqp.service.interface";
import { AmqpService } from "../amqp/services/amqp.service";
import { IMailMessage } from "../mail/interfaces/mail-message.interface";
import { IScheduleMessage } from "../mail/interfaces/schedule-message.interface";
import { Template } from "../template/entities/template.entity";
import { ITemplateService } from "../template/interfaces/template.service.interface";
import { TemplateByIdPipe } from "../template/pipes/template-by-id.pipe";
import { TemplateService } from "../template/services/template.service";
import { AddTemplatesBody } from "./bodies/add-templates.body";
import { TaskStageDto } from "./dto/task-stage.dto";
import { TaskDto } from "./dto/task.dto";
import { TemplateAssignmentDto } from "./dto/template-assignment.dto";
import { TaskStage } from "./entities/task-stage.entity";
import { Task } from "./entities/task.entity";
import { TemplateAssignment } from "./entities/tempalte-assignment.entity";
import { ITaskService } from "./interfaces/task.service.interface";
import { TaskByIdPipe } from "./pipes/task-by-id.pipe";
import { TemplatesByIdsPipe } from "./pipes/templates-by-ids.pipe";
import { FindAllQuery } from "./queries/find-all.query";
import { CreateTaskResponse } from "./responses/create-task.response";
import { GetReportResponse } from "./responses/get-report.response";
import { GetStagesWithFullHistoryResponse } from "./responses/get-stages-with-full-history.response";
import { GetTaskExtendedResponse } from "./responses/get-task-extended.response";
import { GetTaskResponse } from "./responses/get-task.response";
import { GetTasksResponse } from "./responses/get-tasks.response";
import { UpdateTaskResponse } from "./responses/update-task.response";
import { TaskService } from "./services/task.service";

@ApiUseTags("tasks")
@Controller("tasks")
export class TaskController {
    constructor(
        @Inject(TaskService) private readonly taskService: ITaskService,
        @Inject(TemplateService) private readonly templateService: ITemplateService,
        @Inject(AmqpService) private readonly amqpService: IAmqpService,
    ) {}

    @Get("/")
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

    @Post("/")
    @ApiImplicitBody({ name: "task", type: TaskDto, description: "Task JSON" })
    @ApiCreatedResponse({ type: CreateTaskResponse, description: "ID of created Task" })
    async create(@Body("task") taskDto: TaskDto) {
        const task = new Task(taskDto);
        const saved = await this.taskService.insert(task);
        return { success: 1, task_id: saved.id };
    }

    @Put("/:id")
    @ApiImplicitBody({ name: "task", type: TaskDto, description: "Task JSON" })
    @ApiOkResponse({ type: UpdateTaskResponse, description: "ID of updated Template" })
    @ApiNotFoundResponse({ type: ErrorResponse, description: "Task not found" })
    async update(@Param("id", TaskByIdPipe) id: string, @Body("task") taskDto: TaskDto) {
        const task = await this.taskService.findById(id);
        const updated = await this.taskService.update(id, { ...task, ...taskDto });
        return { success: 1, task_id: updated.id };
    }

    @Get("/:id")
    @ApiOkResponse({ type: GetTaskResponse, description: "Task JSON" })
    @ApiNotFoundResponse({ type: ErrorResponse, description: "Task not found" })
    async findById(@Param("id", TaskByIdPipe) id: string) {
        const task = await this.taskService.findById(id, ["stages"]);
        const templates = await this.templateService.findByTaskId(task.id.toString());
        return {
            success: 1,
            task: {
                ...task,
                templates: (templates || []).map(template => template.id),
                stages: (task.stages || []).map(stage => stage.id),
            },
        };
    }

    @Post("/:id/templates")
    @ApiImplicitBody({
        name: "templates",
        type: AddTemplatesBody,
        description: "IDs of Templates to add",
    })
    @ApiOkResponse({ type: BaseResponse })
    @ApiNotFoundResponse({ type: ErrorResponse, description: "Template not found" })
    @ApiNotFoundResponse({ type: ErrorResponse, description: "Task not found" })
    async setTemplateAssignments(
        @Param("id", TaskByIdPipe) id: string,
        @Body("templates", TemplatesByIdsPipe) templateIds: number[],
    ) {
        const templates: Template[] = [];
        for (const templateId of templateIds) {
            const template = await this.templateService.findById(templateId.toString());
            templates.push(template);
        }
        const task = await this.taskService.findById(id, ["assignments"]);
        task.assignments = templates.map(template => new TemplateAssignment({ task, template }));
        await this.taskService.update(id, task);
        return { success: 1 };
    }

    @Put("/:task_id/templates/:template_id")
    @ApiOkResponse({ type: BaseResponse })
    @ApiNotFoundResponse({ type: ErrorResponse, description: "Template not found" })
    @ApiNotFoundResponse({ type: ErrorResponse, description: "Task not found" })
    async updateTemplateAssignment(
        @Param("task_id", TaskByIdPipe) taskId: string,
        @Param("template_id", TemplateByIdPipe) templateId: string,
        @Body() templateAssignmentDto: TemplateAssignmentDto,
    ) {
        const task = await this.taskService.findById(taskId, ["assignments"]);
        task.assignments
            // filter to assignments that relate to
            // current template
            .filter(assignment => assignment.id_template === Number(templateId))
            .forEach((assignment, index) => {
                task.assignments[index] = { ...assignment, ...templateAssignmentDto };
            });
        await this.taskService.update(taskId, task);
        return { success: 1 };
    }

    @Post("/:id/stages")
    @ApiImplicitBody({ type: [TaskStageDto], name: "stages" })
    @ApiOkResponse({ type: BaseResponse })
    @ApiNotFoundResponse({ type: ErrorResponse, description: "Task not found" })
    async addTaskStages(
        @Param("id", TaskByIdPipe) id: string,
        @Body("stages") taskStageDtos: TaskStageDto[],
    ) {
        const task = await this.taskService.findById(id, ["stages"]);
        task.stages = [
            ...task.stages,
            // create stages from dtos
            ...taskStageDtos.map(taskStageDto => new TaskStage({ ...taskStageDto })),
        ];
        await this.taskService.update(id, task);
        return { success: 1 };
    }

    @Delete("/:id")
    @ApiOkResponse({ type: BaseResponse, description: "OK response" })
    @ApiNotFoundResponse({ type: ErrorResponse, description: "Task not found" })
    async deleteById(@Param("id", TaskByIdPipe) id: string) {
        await this.taskService.deleteById(id);
        return { success: 1 };
    }

    @Get("/:id/extended")
    @ApiOkResponse({ type: GetTaskExtendedResponse, description: "Extended Task JSON" })
    @ApiNotFoundResponse({ type: ErrorResponse, description: "Task not found" })
    async findByIdExtended(@Param("id", TaskByIdPipe) id: string) {
        const task = await this.taskService.getTaskExtended(id);
        return { success: 1, task };
    }

    @Get("/:id/stages/history/full")
    @ApiOkResponse({
        type: GetStagesWithFullHistoryResponse,
        description: "Task Stages with history",
    })
    @ApiNotFoundResponse({ type: ErrorResponse, description: "Task not found" })
    async getStagesWithFullHistory(@Param("id", TaskByIdPipe) id: string) {
        const task = await this.taskService.getTaskStagesWithHistory(id);
        return { success: 1, stages: task.stages };
    }

    @Get("/:id/report")
    @ApiOkResponse({ type: GetReportResponse, description: "Task report" })
    @ApiNotFoundResponse({ type: ErrorResponse, description: "Task not found" })
    async getReport(@Param("id", TaskByIdPipe) id: string) {
        const [, report] = await this.taskService.getReport(id);
        return { success: 1, report };
    }

    @Post("/:task_id/answers")
    @ApiConsumes("multipart/form-data")
    @ApiOkResponse({ type: BaseResponse })
    @ApiNotFoundResponse({ type: ErrorResponse, description: "Task not found" })
    @ApiNotFoundResponse({ type: ErrorResponse, description: "Template not found" })
    @ApiNotFoundResponse({ type: ErrorResponse, description: "Puzzle not found" })
    @UseInterceptors(AnyFilesInterceptor())
    async setTemplateAnswers(
        @Param("task_id", TaskByIdPipe) taskId: string,
        @UploadedFiles() files: Express.Multer.File[],
        @Body() body: { [key: string]: string | object },
    ) {
        const templateIds = [...(files || []).map(file => file.fieldname), ...Object.keys(body)];
        await this.taskService.setTaskAnswers(taskId, templateIds, files, body);
        return { success: 1 };
    }

    @Get("/:id/report/file")
    @ApiOkResponse({ description: "XLSX file reposnse" })
    @ApiNotFoundResponse({ type: ErrorResponse, description: "Task not found" })
    @ApiProduces("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
    async getReportFile(@Param("id", TaskByIdPipe) id: string, @Res() res: Response) {
        const [, report] = await this.taskService.getReport(id);
        const buffer = this.taskService.getReportBuffer(report);
        res.type("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.attachment("report.xlsx");
        res.status(200).send(buffer);
    }

    @Get("/:id/report/email/:email")
    @ApiOkResponse({ type: BaseResponse })
    @ApiNotFoundResponse({ type: ErrorResponse, description: "Task not found" })
    async getReportByEmail(@Param("id", TaskByIdPipe) id: string, @Param("email") email: string) {
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
        @Param("id", TaskByIdPipe) id: string,
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
    async cancelScheduledReport(@Param("id", TaskByIdPipe) id: string) {
        const channel = await this.amqpService.getAssertedChannelFor(
            AmqpService.CANCEL_EMAIL_SCHEDULE,
        );
        await channel.sendToQueue(AmqpService.CANCEL_EMAIL_SCHEDULE, Buffer.from(id));
        return { success: 1 };
    }
}
