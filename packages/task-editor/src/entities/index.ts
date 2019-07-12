export interface ITask {
    id: string;
    title: string;
    stage: {
        title: string;
        until: Date | null;
    };
    location: {
        region: string;
        branch: string;
        format: string;
        address: string;
    };
    assignee: string;
}
