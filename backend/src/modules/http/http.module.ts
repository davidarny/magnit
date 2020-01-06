import { HttpModule, Module } from "@nestjs/common";

const http = HttpModule.register({
    timeout: Number(process.env.HTTP_TIMEOUT),
    maxRedirects: Number(process.env.HTTP_MAX_REDIRECTS),
    baseURL: `${process.env.AIRWATCH_BASE_URL}/api`,
    headers: {
        common: {
            Authorization: `Basic ${process.env.AIRWATCH_AUTH}`,
            "aw-tenant-code": process.env.AIRWATCH_TENANT_CODE,
            "Content-Type": "application/json",
        },
    },
});

@Module({
    imports: [http],
    exports: [http],
})
export class AirwatchHttpModule {
    constructor() {
        if (process.env.NODE_ENV !== "testing" && !process.env.AIRWATCH_BASE_URL) {
            throw new Error("Airwatch base url is undefined");
        }
    }
}
