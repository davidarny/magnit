import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response } from "express";

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: Function) {
        const protocol = `${req.protocol.toUpperCase()}/${req.httpVersion}`;
        const url = `${req.method.toUpperCase()} ${req.url}`;
        console.log(`${protocol} ${url}`);
        for (const key of Object.keys(req.headers)) {
            console.log(`${key}: ${req.headers[key]}`);
        }
        if (Object.keys(req.body).length) {
            console.log(JSON.stringify(req.body, null, 4));
        }
        if (Object.keys(req.query).length) {
            console.log(JSON.stringify(req.query, null, 4));
        }
        next();
    }
}
