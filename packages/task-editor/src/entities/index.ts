import * as React from "react";

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
    documents: string[];
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
