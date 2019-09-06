import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TemplateAnswerLocation } from "./entities/template-answer-location.entity";
import { TemplateAnswer } from "./entities/template-answer.entity";
import { Template } from "./entities/template.entity";
import { TemplateService } from "./services/template.service";
import { TemplateController } from "./template.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Template, TemplateAnswer, TemplateAnswerLocation])],
    providers: [TemplateService],
    controllers: [TemplateController],
    exports: [TemplateService],
})
export class TemplateModule {}
