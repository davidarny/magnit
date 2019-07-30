import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TemplateService } from "./services/template.service";
import { TemplateController } from "./template.controller";
import { Template } from "./entities/template.entity";
import { SectionService } from "./services/section.service";
import { Section } from "./entities/section.entity";
import { PuzzleService } from "./services/puzzle.service";
import { Puzzle } from "./entities/puzzle.entity";
import { ConditionService } from "./services/condition.service";
import { Condition } from "./entities/condition.entity";
import { ValidationService } from "./services/validation.service";
import { Validation } from "./entities/validation.entity";

const entities = [Template, Section, Puzzle, Condition, Validation];
const providers = [
    TemplateService,
    SectionService,
    PuzzleService,
    ConditionService,
    ValidationService,
];
const imports = [TypeOrmModule.forFeature(entities)];
const controllers = [TemplateController];

@Module({ imports, providers, controllers })
export class TemplateModule {}
