import { ETaskStatus } from "@magnit/services";
import * as React from "react";

export interface IStageStep {
    id: number;
    title: string;
    dueDate: string;
    completed: boolean;
    editable?: boolean;
}

export interface IBaseTask {
    id?: number;
    title: string;
    descriptions?: string;
    status: ETaskStatus;
    updatedAt?: string;
    createdAt?: string;
}

export interface ITask extends IBaseTask {
    id: number;
    templates: string[];
    stages: string[];
}

export interface IDocument {
    id: number;
    title: string;
    editable: boolean;
    __uuid: string; // need for correct rendering
}

export interface IStage {
    id: number;
    title: string;
    dueDate: string; // ISO time format
    __uuid: string; // need for correct rendering
}

export interface IExtendedTask extends IBaseTask {
    id: number;
    templates: Array<Omit<IDocument, "__uuid">>;
    stages: Array<Omit<IStage, "__uuid">>;
}

interface TChangeParam {
    name?: string;
    value: unknown;
}

export type TChangeEvent = React.ChangeEvent<TChangeParam>;
