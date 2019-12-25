import { Module } from "@nestjs/common";
import { ScheduleModule as NestScheduleModule } from "nest-schedule";
import { ScheduleService } from "./services/schedule.service";

@Module({
    imports: [NestScheduleModule.register()],
    providers: [ScheduleService],
    exports: [ScheduleService],
})
export class ScheduleModule {}
