import { Injectable } from "@nestjs/common";
import { InjectSchedule, Schedule } from "nest-schedule";

@Injectable()
export class ScheduleService {
    constructor(@InjectSchedule() private readonly schedule: Schedule) {}

    createJob(name: string, cron: string, callback: JobCallback): void {
        this.schedule.scheduleCronJob(name, cron, callback);
    }

    cancelJob(name: string): void {
        this.schedule.cancelJob(name);
    }
}
