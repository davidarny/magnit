import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { TypeOrmModule } from "@nestjs/typeorm";
import { createHash } from "crypto";
import { diskStorage } from "multer";
import { extname } from "path";
import { TemplateAnswer } from "../template/entities/template-answer.entity";
import { Template } from "../template/entities/template.entity";
import { TemplateService } from "../template/services/template.service";
import { StageHistory } from "./entities/stage-history.entity";
import { TaskStage } from "./entities/task-stage.entity";
import { Task } from "./entities/task.entity";
import { TaskService } from "./services/task.service";
import { TaskStageSubscriber } from "./subscribers/task-stage.subscriber";
import { TaskSubscriber } from "./subscribers/task.subscriber";
import { TaskController } from "./task.controller";

const MAX_HASH_LENGTH = 28;

const controllers = [TaskController];
const providers = [TaskService, TemplateService, TaskSubscriber, TaskStageSubscriber];
const entities = [Task, Template, TaskStage, StageHistory, TemplateAnswer];
const imports = [
    TypeOrmModule.forFeature(entities),
    MulterModule.register({
        storage: diskStorage({
            destination: "./public",
            filename(
                req: Express.Request,
                file: Express.Multer.File,
                callback: (error: Error | null, filename: string) => void,
            ): void {
                callback(
                    null,
                    `${createHash("sha256")
                        .update(new Date().valueOf().toString() + Math.random().toString())
                        .digest("hex")
                        .toString()
                        .substring(0, MAX_HASH_LENGTH)}${extname(file.originalname)}`,
                );
            },
        }),
    }),
];

@Module({ controllers, providers, imports })
export class TaskModule {}
