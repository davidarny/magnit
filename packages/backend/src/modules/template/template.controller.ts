import { Body, Controller, Get, Post } from "@nestjs/common";
import { TemplateService } from "./template.service";
import { TemplateDto } from "./template.dto";
import { Puzzle } from "./puzzle.entity";
import { Section } from "./section.entity";
import { Template } from "./template.entity";
import { deeplyCreatePuzzles } from "./template.helpers";

@Controller("templates")
export class TemplateController {
    constructor(private readonly templateService: TemplateService) {}

    @Get("/")
    async findAll() {
        const templates = await this.templateService.findAll();
        return { success: 1, total: templates.length, templates };
    }

    @Post("/")
    async create(@Body("template") templateDto: TemplateDto) {
        const puzzles: Puzzle[] = [];
        const sections: Section[] = [];

        const template = new Template();
        template.title = templateDto.title;
        template.id = templateDto.id;
        template.description = templateDto.description;
        template.type = templateDto.type;

        for (const sectionDto of templateDto.sections) {
            const section = new Section();
            section.template = template;
            section.description = sectionDto.description;
            section.title = sectionDto.title;
            section.order = sectionDto.order;

            puzzles.length = 0;
            deeplyCreatePuzzles(puzzles, sectionDto.puzzles, section, template);

            section.puzzles = puzzles;
            sections.push(section);
        }

        template.sections = sections;
        const saved = await this.templateService.save(template);

        return { success: 1, template_id: saved.id };
    }
}
