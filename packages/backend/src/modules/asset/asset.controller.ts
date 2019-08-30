import { Controller, Delete, Param, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import {
    ApiConsumes,
    ApiImplicitFile,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiUseTags,
} from "@nestjs/swagger";
import { existsSync, unlinkSync } from "fs";
import { AssetNotFoundException } from "../../shared/exceptions/asset-not-found.exception";
import { BaseResponse } from "../../shared/responses/base.response";
import { FileDto } from "./dto/file.dto";
import { UploadFileResponse } from "./responses/upload-file.response";

@ApiUseTags("assets")
@Controller("assets")
export class AssetController {
    @Post("/")
    @ApiConsumes("multipart/form-data")
    @ApiImplicitFile({ name: "file", required: true })
    @ApiOkResponse({ type: UploadFileResponse })
    @UseInterceptors(FileInterceptor("file"))
    upload(@UploadedFile() file: FileDto) {
        return { success: 1, filename: file.filename };
    }

    @Delete("/:filename")
    @ApiOkResponse({ type: BaseResponse })
    @ApiNotFoundResponse({ description: "File not found" })
    delete(@Param("filename") filename: string) {
        const pathToFile = process.cwd() + `/public/${filename}`;
        if (!existsSync(pathToFile)) {
            throw new AssetNotFoundException(`File "${filename}" Not Found`);
        }
        unlinkSync(pathToFile);
        return { success: 1 };
    }
}
