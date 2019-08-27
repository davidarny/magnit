import { Body, Controller, Delete, Get, Inject, Param, Post, Put, Query } from "@nestjs/common";
import {
    ApiCreatedResponse,
    ApiImplicitBody,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiUseTags,
} from "@nestjs/swagger";
import { Transactional } from "typeorm-transactional-cls-hooked";
import { Template } from "./entities/template.entity";
import { ITemplateService } from "./interfaces/template.service.interface";
import { BaseResponse } from "../../shared/responses/base.response";
import { ErrorResponse } from "../../shared/responses/error.response";
import { TemplateService } from "./services/template.service";
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
    constructor(@Inject(TemplateService) private readonly templateService: ITemplateService) {}

    @Get("/")
    @ApiOkResponse({ type: GetTemplatesResponse, description: "Get all Templates" })
    async findAll(@Query() query?: FindAllQuery) {
        const { offset, limit, sort, title } = { ...new FindAllQuery(), ...query };
        const templates = await this.templateService.findAll(offset, limit, sort, title);
        return { success: 1, total: templates.length, templates };
    }

    @Post("/")
    @ApiImplicitBody({ name: "template", type: TemplateDto, description: "Template JSON" })
    @ApiCreatedResponse({ type: CreateTemplateResponse, description: "ID of created Template" })
    async create(@Body("template") templateDto: TemplateDto) {
        const template = new Template(templateDto);
        const saved = await this.templateService.insert(template);
        return { success: 1, template_id: saved.id };
    }

    @Put("/:id")
    @ApiImplicitBody({ name: "template", type: TemplateDto, description: "Template JSON" })
    @ApiOkResponse({ type: UpdateTemplateResponse, description: "ID of updated Template" })
    @ApiNotFoundResponse({ type: ErrorResponse, description: "Template not found" })
    async update(
        @Param("id", TemplateByIdPipe) id: string,
        @Body("template") templateDto: TemplateDto,
    ) {
        const template = new Template(templateDto);
        const saved = await this.templateService.update(id, template);
        return { success: 1, template_id: saved.id };
    }

    @Get("/:id")
    @ApiOkResponse({ type: GetTemplateResponse, description: "Stringified Template JSON" })
    @ApiNotFoundResponse({ type: ErrorResponse, description: "Template not found" })
    async findById(@Param("id", TemplateByIdPipe) id: string) {
        const template = await this.templateService.findById(id);
        return { success: 1, template: JSON.stringify(template) };
    }

    @Delete("/:id")
    @ApiOkResponse({ type: BaseResponse, description: "OK response" })
    @ApiNotFoundResponse({ type: ErrorResponse, description: "Template not found" })
    async deleteById(@Param("id", TemplateByIdPipe) id: string) {
        await this.templateService.deleteById(id);
        return { success: 1 };
    }
}
