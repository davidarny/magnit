import { ETaskStatus } from "@magnit/services";
import * as React from "react";

export interface IStep {
    id: string;
    title: string;
    date: string;
    completed: boolean;
    editable?: boolean;
}

export interface IBaseTask {
    id?: string;
    title: string;
    descriptions?: string;
    status?: ETaskStatus;
    updatedAt?: string;
    createdAt?: string;
}

export interface ITask extends IBaseTask {
    id: string;
    templates: string[];
}

export interface IDocument {
    id: string;
    title: string;
    editable: boolean;
    __uuid: string; // need for correct rendering
}

export interface IExtendedTask extends IBaseTask {
    id: string;
    templates: Array<Omit<IDocument, "__uuid">>;
}

interface TChangeParam {
    name?: string;
    value: unknown;
}

export type TChangeEvent = React.ChangeEvent<TChangeParam>;
