import * as React from "react";

export interface IStep {
    id: string;
    title: string;
    date: string;
    completed: boolean;
    editable?: boolean;
}

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
    templates: string[];
}

export interface IDocument {
    id: string;
    title: string;
    __uuid: string; // need for correct rendering
}

interface TChangeParam {
    name?: string;
    value: unknown;
}

export type TChangeEvent = React.ChangeEvent<TChangeParam>;
