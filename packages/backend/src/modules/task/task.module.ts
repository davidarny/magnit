import { Module } from "@nestjs/common";
import { MulterModule } from "@nestjs/platform-express";
import { TypeOrmModule } from "@nestjs/typeorm";
import { createHash } from "crypto";
import { diskStorage } from "multer";
import { extname } from "path";
import { AmqpModule } from "../amqp/amqp.module";
import { PushTokenModule } from "../push-token/push-token.module";
import { TemplateModule } from "../template/template.module";
import { StageHistory } from "./entities/stage-history.entity";
import { TaskStage } from "./entities/task-stage.entity";
import { Task } from "./entities/task.entity";
import { TaskService } from "./services/task.service";
import { TaskStageSubscriber } from "./subscribers/task-stage.subscriber";
import { TaskSubscriber } from "./subscribers/task.subscriber";
import { TaskController } from "./task.controller";

const MAX_HASH_LENGTH = 28;

@Module({
    controllers: [TaskController],
    providers: [TaskService, TaskSubscriber, TaskStageSubscriber],
    imports: [
        TypeOrmModule.forFeature([Task, TaskStage, StageHistory]),
        // TODO: delegate to separate module
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
        PushTokenModule,
        AmqpModule,
        TemplateModule,
    ],
    exports: [TaskService],
})
export class TaskModule {}
