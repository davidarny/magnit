import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TemplateAnswer } from "./entities/template-answer.entity";
import { Template } from "./entities/template.entity";
import { TemplateService } from "./services/template.service";
import { TemplateController } from "./template.controller";

const entities = [Template, TemplateAnswer];
const providers = [TemplateService];
const imports = [TypeOrmModule.forFeature(entities)];
const controllers = [TemplateController];

@Module({ imports, providers, controllers })
export class TemplateModule {}
