import { Injectable } from "@nestjs/common";
import { InjectSchedule, Schedule } from "nest-schedule";
import { IScheduleService } from "../interfaces/schedule.service.interface";

@Injectable()
export class ScheduleService implements IScheduleService {
    constructor(@InjectSchedule() private readonly schedule: Schedule) {}

    createJob(name: string, cron: string, callback: JobCallback): void {
        this.schedule.scheduleCronJob(name, cron, callback);
    }

    cancelJob(name: string): void {
        this.schedule.cancelJob(name);
    }
}
