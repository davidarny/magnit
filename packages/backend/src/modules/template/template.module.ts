import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TemplateService } from "../../shared/services/template.service";
import { TemplateController } from "./template.controller";
import { Template } from "../../shared/entities/template.entity";
import { SectionService } from "../../shared/services/section.service";
import { Section } from "../../shared/entities/section.entity";
import { PuzzleService } from "../../shared/services/puzzle.service";
import { Puzzle } from "../../shared/entities/puzzle.entity";
import { Condition } from "../../shared/entities/condition.entity";
import { Validation } from "../../shared/entities/validation.entity";
import { PuzzleAssemblerService } from "../../shared/services/puzzle-assembler.service";

const entities = [Template, Section, Puzzle, Condition, Validation];
const providers = [TemplateService, SectionService, PuzzleService, PuzzleAssemblerService];
const imports = [TypeOrmModule.forFeature(entities)];
const controllers = [TemplateController];

@Module({ imports, providers, controllers })
export class TemplateModule {}
