import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Template } from "../../shared/entities/template.entity";
import { TemplateService } from "../../shared/services/template.service";
import { TemplateController } from "./template.controller";

const entities = [Template];
const providers = [TemplateService];
const imports = [TypeOrmModule.forFeature(entities)];
const controllers = [TemplateController];

@Module({ imports, providers, controllers })
export class TemplateModule {}
