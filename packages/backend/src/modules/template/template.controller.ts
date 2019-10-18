import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from "@nestjs/common";
import {
    ApiBearerAuth,
    ApiCreatedResponse,
    ApiImplicitBody,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiUseTags,
} from "@nestjs/swagger";
import { NumericIdPipe } from "../../shared/pipes/numeric-id.pipe";
import { BaseResponse } from "../../shared/responses/base.response";
import { ErrorResponse } from "../../shared/responses/error.response";
import { AirwatchAuthGuard } from "../auth/guards/airwatch.auth.guard";
import { TemplateDto } from "./dto/template.dto";
import { Template } from "./entities/template.entity";
import { TemplateByIdPipe } from "./pipes/template-by-id.pipe";
import { FindAllQuery } from "./queries/find-all.query";
import { CreateTemplateResponse } from "./responses/create-template.response";
import { GetTemplateResponse } from "./responses/get-template.response";
import {
    GetTemplatesExtendedResponse,
    GetTemplatesResponse,
} from "./responses/get-templates.response";
import { UpdateTemplateResponse } from "./responses/update-template.response";
import { TemplateService } from "./services/template.service";

@ApiBearerAuth()
@UseGuards(AirwatchAuthGuard)
@ApiUseTags("templates")
@Controller("templates")
export class TemplateController {
    constructor(private readonly templateService: TemplateService) {}

    @Get("/")
    @ApiOkResponse({ type: GetTemplatesResponse, description: "Get all Templates" })
    async findAll(@Query() query?: FindAllQuery) {
        const [templates, all] = await this.templateService.findAll(new FindAllQuery(query));
        return { success: 1, total: templates.length, templates, all };
    }

    @Get("/extended")
    @ApiOkResponse({
        type: GetTemplatesExtendedResponse,
        description: "Get all Templates with Section",
    })
    async findAllExtended(@Query() query?: FindAllQuery) {
        const [templates, all] = await this.templateService.findAll(new FindAllQuery(query), true);
        return { success: 1, total: templates.length, templates, all };
    }

    @Post("/")
    @ApiImplicitBody({ name: "template", type: TemplateDto, description: "Template JSON" })
    @ApiCreatedResponse({ type: CreateTemplateResponse, description: "ID of created Template" })
    async create(@Body("template") templateDto: TemplateDto) {
        const saved = await this.templateService.insert(new Template(templateDto));
        return { success: 1, template_id: saved.id };
    }

    @Put("/:id")
    @ApiImplicitBody({ name: "template", type: TemplateDto, description: "Template JSON" })
    @ApiOkResponse({ type: UpdateTemplateResponse, description: "ID of updated Template" })
    @ApiNotFoundResponse({ type: ErrorResponse, description: "Template not found" })
    async update(
        @Param("id", NumericIdPipe, TemplateByIdPipe) id: number,
        @Body("template") templateDto: TemplateDto,
    ) {
        const saved = await this.templateService.update(id, new Template(templateDto));
        return { success: 1, template_id: saved.id };
    }

    @Get("/:id")
    @ApiOkResponse({ type: GetTemplateResponse, description: "Stringified Template JSON" })
    @ApiNotFoundResponse({ type: ErrorResponse, description: "Template not found" })
    async findById(@Param("id", NumericIdPipe, TemplateByIdPipe) id: number) {
        const template = await this.templateService.findById(id);
        return { success: 1, template: JSON.stringify(template) };
    }

    @Delete("/:id")
    @ApiOkResponse({ type: BaseResponse, description: "OK response" })
    @ApiNotFoundResponse({ type: ErrorResponse, description: "Template not found" })
    async deleteById(@Param("id", NumericIdPipe, TemplateByIdPipe) id: number) {
        await this.templateService.deleteById(id);
        return { success: 1 };
    }
}
