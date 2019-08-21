import { Module } from "@nestjs/common";
import { TaskStage } from "./entities/task-stage.entity";
import { TaskController } from "./task.controller";
import { TaskService } from "./services/task.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Task } from "./entities/task.entity";
import { TemplateService } from "../template/services/template.service";
import { Template } from "../template/entities/template.entity";

const controllers = [TaskController];
const providers = [TaskService, TemplateService];
const entities = [Task, Template, TaskStage];
const imports = [TypeOrmModule.forFeature(entities)];

@Module({ controllers, providers, imports })
export class TaskModule {}
