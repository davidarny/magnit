import { ETaskStatus } from "enums";

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
    notifyBefore?: number;
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
}

export interface IRenderDocument extends IDocument {
    __uuid: string; // need for correct rendering
}

export interface IVirtualDocument extends IRenderDocument {
    virtual?: boolean;
}

export interface IStage {
    id: number;
    title: string;
    deadline: string; // ISO time format
    finished: boolean;
    editable?: boolean;
    __index?: number; // need for correct rendering
}

export interface IAnswer {
    answer: string;
    answerType: "string" | "number";
    comment?: string;
    id: number;
    idPuzzle: number;
    idTask: number;
    idTemplate: number;
    createdAt: string;
    updatedAt: string;
}

export interface IComment {
    id: number;
    text: string;
    idUser: string;
    idAssignment: number;
    createdAt: string;
    updatedAt: string;
}

export interface IExtendedDocument {
    answers?: IAnswer[];
    comments?: IComment[];
}

export interface ITaskDocument {
    id: number;
    originalName: string;
    filename: string;
}

export interface IExtendedTask extends IBaseTask {
    id: number;
    templates: Array<IDocument & IExtendedDocument>;
    stages: IStage[];
    documents: ITaskDocument[];
}
