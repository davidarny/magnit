import { HttpException, HttpStatus } from "@nestjs/common";

export class AssetNotFoundException extends HttpException {
    constructor(message: string) {
        super(
            {
                errorCode: 7,
                error: "Not Found",
                message,
                statusCode: HttpStatus.NOT_FOUND,
            },
            HttpStatus.NOT_FOUND,
        );
    }
}
