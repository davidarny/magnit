import { Test } from "@nestjs/testing";
import { createMockFrom } from "../../../utils/create-mock.util";
import { AmqpService } from "../../amqp/services/amqp.service";
import { ScheduleService } from "../../schedule/services/schedule.service";
import { TemplateService } from "../../template/services/template.service";
import { TaskReportDto } from "../dto/task-report.dto";
import { TaskDto } from "../dto/task.dto";
import { ETaskStatus, Task } from "../entities/task.entity";
import { TaskService } from "../services/task.service";
import { TaskController } from "../task.controller";
import { User } from "../../user/entities/user.entity";

describe("TaskController", () => {
    let taskController: TaskController;
    const taskService = createMockFrom(TaskService.prototype);
    const templateService = createMockFrom(TemplateService.prototype);
    const amqpService = createMockFrom(AmqpService.prototype);
    const scheduleService = createMockFrom(ScheduleService.prototype);

    const task: Task = {
        id: 0,
        title: "title",
        description: "description",
        status: ETaskStatus.IN_PROGRESS,
        assignments: [],
        stages: [],
        answers: [],
        documents: [],
        owner: new User({
            email: "",
            password: "",
            id: 0,
            firstName: "",
            lastName: "",
        }),
        marketplace: {
            id: 0,
            address: "",
            city: "",
            format: "",
            region: "",
            updated_at: new Date().toISOString(),
            created_at: new Date().toISOString(),
        },
        id_marketplace: null,
        id_assignee: null,
        id_owner: null,
        notify_before: 3,
        updated_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
    };

    beforeEach(async () => {
        const app = await Test.createTestingModule({
            providers: [
                {
                    provide: TaskService,
                    useValue: taskService,
                },
                {
                    provide: TemplateService,
                    useValue: templateService,
                },
                {
                    provide: AmqpService,
                    useValue: amqpService,
                },
                {
                    provide: ScheduleService,
                    useValue: scheduleService,
                },
            ],
            controllers: [TaskController],
        }).compile();

        taskController = app.get(TaskController);
    });

    it("should return empty list of tasks", async () => {
        const expected = { success: 1, total: 0, tasks: [], all: 0 };
        jest.spyOn(taskService, "findAll").mockResolvedValue([[], 0]);
        expect(await taskController.findAll()).toStrictEqual(expected);
    });

    it("should create task", async () => {
        const expected = { success: 1, task_id: 0 };
        jest.spyOn(taskService, "insert").mockResolvedValue(task.id);
        expect(await taskController.create(new TaskDto(task), null)).toStrictEqual(expected);
    });

    it("should get task by id", async () => {
        const expected = { success: 1, task };
        jest.spyOn(taskService, "findById").mockResolvedValue(task);
        expect(await taskController.findById(0)).toStrictEqual(expected);
    });

    it("should return list of task with created task", async () => {
        const expected = { success: 1, total: 1, tasks: [task], all: 1 };
        jest.spyOn(taskService, "findAll").mockResolvedValue([[task], 1]);
        expect(await taskController.findAll()).toStrictEqual(expected);
    });

    it("should add template to task", async () => {
        const expected = { success: 1 };
        jest.spyOn(taskService, "findById").mockResolvedValue(task);
        expect(await taskController.setTemplateAssignments(0, [0])).toStrictEqual(expected);
    });

    it("should update task", async () => {
        const expected = { success: 1 };
        const updated = { ...task, name: "updated task" };
        expect(await taskController.update(0, new TaskDto(updated))).toStrictEqual(expected);
    });

    it("should get tasks with updated task", async () => {
        const updated = { ...task, name: "updated task" };
        const expected = { success: 1, total: 1, tasks: [updated], all: 1 };
        jest.spyOn(taskService, "findAll").mockResolvedValue([[updated], 1]);
        expect(await taskController.findAll()).toStrictEqual(expected);
    });

    it("should delete task", async () => {
        const expected = { success: 1 };
        expect(await taskController.deleteById(0)).toStrictEqual(expected);
    });

    it("should get task report", async () => {
        const report = new TaskReportDto();
        jest.spyOn(taskService, "getReport").mockResolvedValue([task, report]);
        const actual = await taskController.getReport(0);
        expect(taskService.getReport).toHaveBeenCalledWith(0);
        const expected = { success: 1, report };
        expect(actual).toEqual(expected);
    });
});
