import { Body, Controller, Delete, Get, Param, Post, Put, Query } from "@nestjs/common";
import { TemplateService } from "./services/template.service";
import { TemplateDto } from "./dto/template.dto";
import { deeplyCreatePuzzles } from "./helpers/template.helpers";
import { Puzzle } from "./entities/puzzle.entity";
import { Template } from "./entities/template.entity";
import { Section } from "./entities/section.entity";
import { SectionService } from "./services/section.service";
import { PuzzleService } from "./services/puzzle.service";
import { ConditionService } from "./services/condition.service";
import { ValidationService } from "./services/validation.service";
import { TemplateByIdPipe } from "./template-by-id.pipe";
import {
    ApiCreatedResponse,
    ApiImplicitBody,
    ApiImplicitQuery,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiUseTags,
} from "@nestjs/swagger";
import { CreateTemplateResponse } from "./responses/create-template.response";
import { GetTemplateResponse } from "./responses/get-template.response";
import { UpdateTemplateResponse } from "./responses/update-template.response";
import { ErrorResponse } from "./responses/error.response";
import { GetTemplatesResponse } from "./responses/get-templates.response";
import { BaseResponse } from "../../shared/base.response";

@ApiUseTags("templates")
@Controller("templates")
export class TemplateController {
    constructor(
        private readonly templateService: TemplateService,
        private readonly sectionService: SectionService,
        private readonly puzzleService: PuzzleService,
        private readonly conditionService: ConditionService,
        private readonly validationService: ValidationService
    ) {}

    @Get("/")
    @ApiImplicitQuery({ name: "offset", description: "Defaults to 0" })
    @ApiImplicitQuery({ name: "limit", description: "Defaults to 10" })
    @ApiImplicitQuery({ name: "sort", enum: ["ASC", "DESC"], description: "Defaults to ASC" })
    @ApiImplicitQuery({ name: "title", description: "Query Template by title" })
    @ApiOkResponse({ type: GetTemplatesResponse, description: "Get all Templates" })
    async findAll(
        @Query("offset") offset: number = 0,
        @Query("limit") limit: number = 10,
        @Query("sort") sort: "ASC" | "DESC" = "ASC",
        @Query("title") title?: string
    ) {
        const templates = await this.templateService.findAll(offset, limit, sort, title);
        return { success: 1, total: templates.length, templates };
    }

    @Post("/")
    @ApiImplicitBody({ name: "template", type: TemplateDto, description: "Template JSON" })
    @ApiCreatedResponse({ type: CreateTemplateResponse, description: "ID of created Template" })
    async create(@Body("template") templateDto: TemplateDto) {
        const puzzles: Puzzle[] = [];
        const sections: Section[] = [];

        const template = new Template(templateDto);

        for (const sectionDto of templateDto.sections) {
            const section = new Section(sectionDto);

            puzzles.length = 0;
            deeplyCreatePuzzles(puzzles, sectionDto.puzzles, section, template);

            section.puzzles = puzzles;
            sections.push(section);
        }

        template.sections = sections;
        const saved = await this.templateService.save(template);

        return { success: 1, template_id: saved.id };
    }

    @Put("/:id")
    @ApiImplicitBody({ name: "template", type: TemplateDto, description: "Template JSON" })
    @ApiOkResponse({ type: UpdateTemplateResponse, description: "ID of updated Template" })
    @ApiNotFoundResponse({ type: ErrorResponse, description: "No Template with this ID found" })
    async update(
        @Param("id", TemplateByIdPipe) id: string,
        @Body("template") templateDto: TemplateDto
    ) {
        await this.templateService.deleteById(id);
        const { template_id } = await this.create(templateDto);
        return { success: 1, template_id };
    }

    @Get("/:id")
    @ApiOkResponse({ type: GetTemplateResponse, description: "Stringified Template JSON" })
    @ApiNotFoundResponse({ type: ErrorResponse, description: "No Template with this ID found" })
    async findById(@Param("id", TemplateByIdPipe) id: string) {
        const template = await this.templateService.findById(id);
        template.sections = await this.sectionService.findByTemplateId(template.id);
        for (const section of template.sections || []) {
            section.puzzles = await this.puzzleService.findBySectionId(section.id);
        }
        const puzzles: Puzzle[] = [
            ...template.sections.reduce((prev, curr) => [...prev, ...curr.puzzles], []),
        ];
        for (const puzzle of puzzles) {
            if (puzzle.puzzle_type === "group") {
                puzzle.children = await this.puzzleService.findByParentId(puzzle.id);
                puzzles.push(...puzzle.children);
            }
        }
        for (const puzzle of puzzles) {
            const conditions = await this.conditionService.findByPuzzleId(puzzle.id);
            puzzle.conditions = conditions || [];
            const validations = await this.validationService.findByPuzzleId(puzzle.id);
            puzzle.validations = validations || [];
        }
        return { success: 1, template: JSON.stringify(template) };
    }

    @Delete("/:id")
    @ApiOkResponse({ type: BaseResponse, description: "OK response" })
    @ApiNotFoundResponse({ type: ErrorResponse, description: "No Template with this ID found" })
    async deleteById(@Param("id", TemplateByIdPipe) id: string) {
        await this.templateService.deleteById(id);
        return { success: 1 };
    }
}
