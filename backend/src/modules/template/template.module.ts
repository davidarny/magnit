import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AirwatchAuthModule } from "../auth/airwatch.auth.module";
import { PushTokenModule } from "../push-token/push-token.module";
import { TemplateAnswerLocation } from "./entities/template-answer-location.entity";
import { TemplateAnswer } from "./entities/template-answer.entity";
import { Template } from "./entities/template.entity";
import { TemplateService } from "./services/template.service";
import { TemplateController } from "./template.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([Template, TemplateAnswer, TemplateAnswerLocation]),
        PushTokenModule,
        AirwatchAuthModule,
    ],
    providers: [TemplateService],
    controllers: [TemplateController],
    exports: [TemplateService],
})
export class TemplateModule {}
