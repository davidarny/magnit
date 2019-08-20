import { ETaskStatus } from "@magnit/services";
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
    descriptions: string;
    status: ETaskStatus;
    updatedAt: string;
    createdAt: string;
}

export interface ITaskWithTemplates extends ITask {
    templates: string[];
}

export interface IDocument {
    id: string;
    title: string;
    editable: boolean;
    __uuid: string; // need for correct rendering
}

export interface IExtendedTask extends ITask {
    templates: Array<Omit<IDocument, "__uuid">>;
}

interface TChangeParam {
    name?: string;
    value: unknown;
}

export type TChangeEvent = React.ChangeEvent<TChangeParam>;
