import { join } from "path";
import { FileLogger, Logger } from "typeorm";
import { PlatformTools } from "typeorm/platform/PlatformTools";

export class CustomFileLogger extends FileLogger implements Logger {
    protected write(strings: string | string[]): void {
        strings = strings instanceof Array ? strings : [strings];
        const basePath = join(__dirname, "..", "..", "..", "logs");
        strings = (strings as string[]).map(str => "[" + new Date().toISOString() + "]" + str);
        PlatformTools.appendFileSync(basePath + "/ormlogs.log", strings.join("\r\n") + "\r\n");
    }
}
