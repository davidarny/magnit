import { ArgumentsHost, Catch, HttpException, InternalServerErrorException } from "@nestjs/common";
import { BaseExceptionFilter } from "@nestjs/core";

@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        if (exception instanceof HttpException) {
            super.catch(exception, host);
        } else {
            super.catch(new InternalServerErrorException("Internal Server Error"), host);
        }
    }
}
