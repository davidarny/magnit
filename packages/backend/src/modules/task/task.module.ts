import { Module } from "@nestjs/common";
import { TaskController } from "./task.controller";
import { TaskService } from "./services/task.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Task } from "./entities/task.entity";
import { TemplateService } from "../../shared/services/template.service";
import { Template } from "../../shared/entities/template.entity";
import { SectionService } from "../../shared/services/section.service";
import { PuzzleService } from "../../shared/services/puzzle.service";
import { Section } from "../../shared/entities/section.entity";
import { Puzzle } from "../../shared/entities/puzzle.entity";
import { Condition } from "../../shared/entities/condition.entity";
import { Validation } from "../../shared/entities/validation.entity";
import { PuzzleAssemblerService } from "../../shared/services/puzzle-assembler.service";

const controllers = [TaskController];
const providers = [
    TaskService,
    TemplateService,
    PuzzleService,
    SectionService,
    PuzzleAssemblerService,
];
const entities = [Task, Template, Section, Puzzle, Condition, Validation];
const imports = [TypeOrmModule.forFeature(entities)];

@Module({ controllers, providers, imports })
export class TaskModule {}
