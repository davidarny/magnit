import { Module } from "@nestjs/common";
import { StageHistory } from "./entities/stage-history.entity";
import { TaskStage } from "./entities/task-stage.entity";
import { TaskStageSubscriber } from "./subscribers/task-stage.subscriber";
import { TaskSubscriber } from "./subscribers/task.subscriber";
import { TaskController } from "./task.controller";
import { TaskService } from "./services/task.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Task } from "./entities/task.entity";
import { TemplateService } from "../template/services/template.service";
import { Template } from "../template/entities/template.entity";

const controllers = [TaskController];
const providers = [TaskService, TemplateService, TaskSubscriber, TaskStageSubscriber];
const entities = [Task, Template, TaskStage, StageHistory];
const imports = [TypeOrmModule.forFeature(entities)];

@Module({ controllers, providers, imports })
export class TaskModule {}
