import { ETaskStatus } from "@magnit/services";
import * as React from "react";

export interface IStageStep {
    id: number;
    title: string;
    deadline: string;
    completed?: boolean;
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

export interface IVirtualDocument extends IDocument {
    virtual?: boolean;
}

export interface IStage {
    id: number;
    title: string;
    deadline: string; // ISO time format
    finished: boolean;
    editable?: boolean;
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
