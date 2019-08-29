export interface IScheduleService {
    createJob(name: string, cron: string, callback: JobCallback): void;

    cancelJob(name: string): void;
}
