import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query } from "@nestjs/common";
import {
    ApiCreatedResponse,
    ApiImplicitBody,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiUseTags,
} from "@nestjs/swagger";
import { Puzzle } from "../../shared/entities/puzzle.entity";
import { Section } from "../../shared/entities/section.entity";
import { Template } from "../../shared/entities/template.entity";
import { IAssemblerService } from "../../shared/interfaces/assembler.service.interface";
import { IPuzzleService } from "../../shared/interfaces/puzzle.service.interface";
import { ISectionService } from "../../shared/interfaces/section.service.interface";
import { ITemplateService } from "../../shared/interfaces/template.service.interface";
import { BaseResponse } from "../../shared/responses/base.response";
import { ErrorResponse } from "../../shared/responses/error.response";
import { PuzzleAssemblerService } from "../../shared/services/puzzle-assembler.service";
import { PuzzleService } from "../../shared/services/puzzle.service";
import { SectionService } from "../../shared/services/section.service";
import { TemplateService } from "../../shared/services/template.service";
import { TemplateDto } from "./dto/template.dto";
import { TemplateByIdPipe } from "./pipes/template-by-id.pipe";
import { FindAllQuery } from "./queries/find-all.query";
import { CreateTemplateResponse } from "./responses/create-template.response";
import { GetTemplateResponse } from "./responses/get-template.response";
import { GetTemplatesResponse } from "./responses/get-templates.response";
import { UpdateTemplateResponse } from "./responses/update-template.response";

@ApiUseTags("templates")
@Controller("templates")
export class TemplateController {
    constructor(
        @Inject(TemplateService) private readonly templateService: ITemplateService,
        @Inject(SectionService) private readonly sectionService: ISectionService,
        @Inject(PuzzleService) private readonly puzzleService: IPuzzleService,
        @Inject(PuzzleAssemblerService) private readonly assemblerService: IAssemblerService,
    ) {}

    @Get("/")
    @ApiOkResponse({ type: GetTemplatesResponse, description: "Get all Templates" })
    async findAll(@Query() query?: FindAllQuery) {
        const { offset, limit, sort, title } = query || new FindAllQuery();
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
            this.puzzleService.deeplyCreatePuzzles(puzzles, sectionDto.puzzles, section, template);

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
        @Body("template") templateDto: TemplateDto,
    ) {
        const puzzles: Puzzle[] = [];
        const sections: Section[] = [];

        const template = new Template(templateDto);

        for (const sectionDto of templateDto.sections) {
            const section = new Section(sectionDto);

            puzzles.length = 0;
            this.puzzleService.deeplyCreatePuzzles(puzzles, sectionDto.puzzles, section, template);

            section.puzzles = puzzles;
            sections.push(section);
        }

        template.sections = sections;
        const saved = await this.templateService.save(template, false);

        return { success: 1, template_id: saved.id };
    }

    @Get("/:id")
    @ApiOkResponse({ type: GetTemplateResponse, description: "Stringified Template JSON" })
    @ApiNotFoundResponse({ type: ErrorResponse, description: "No Template with this ID found" })
    async findById(@Param("id", TemplateByIdPipe) id: string) {
        const template = await this.templateService.findById(id);
        await this.assemblerService.assemble(template);
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
