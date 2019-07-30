import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Template } from "./template.entity";
import { TemplateService } from "./template.service";
import { TemplateController } from "./template.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Template])],
    providers: [TemplateService],
    controllers: [TemplateController],
})
export class TemplateModule {}
