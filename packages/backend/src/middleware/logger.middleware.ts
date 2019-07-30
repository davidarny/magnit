import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: Function) {
        const protocol = `${req.protocol.toUpperCase()}/${req.httpVersion}`;
        const url = `${req.method.toUpperCase()} ${req.url}`;
        const date = `${this.getFriendlyDate(new Date())}`;
        console.log(`\n[${date}] ${protocol} ${url}`);
        for (const key of Object.keys(req.headers)) {
            console.log(`${key}: ${req.headers[key]}`);
        }
        next();
    }

    private getFriendlyDate(date: Date): string {
        const left = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        const right = `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`;
        return `${left} ${right}`;
    }
}
