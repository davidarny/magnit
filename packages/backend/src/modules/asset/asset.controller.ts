import {
    Controller,
    Delete,
    NotFoundException,
    Param,
    Post,
    UploadedFile,
    UseInterceptors,
} from "@nestjs/common";
import {
    ApiConsumes,
    ApiImplicitFile,
    ApiNotFoundResponse,
    ApiOkResponse,
    ApiUseTags,
} from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";
import { FileDto } from "./dto/file.dto";
import { UploadFileResponse } from "./responses/upload-file.response";
import { BaseResponse } from "../../shared/responses/base.response";
import { existsSync, unlinkSync } from "fs";

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
            throw new NotFoundException(`File "${filename}" not found`);
        }
        unlinkSync(pathToFile);
        return { success: 1 };
    }
}
