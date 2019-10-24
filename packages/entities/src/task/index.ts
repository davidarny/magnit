import { EPuzzleType, ETaskStatus } from "../enums";
import { ITemplate } from "../template";

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
    idOwner?: string;
    idAssignee?: string;
}

export interface ITemplateDocument extends ITemplate {
    editable?: boolean;
}

export interface IRenderTemplateDocument extends ITemplateDocument {
    __uuid: string; // need for correct rendering
}

export interface IVirtualTemplateDocument extends IRenderTemplateDocument {
    virtual?: boolean;
}

export interface IStage {
    id: number;
    title: string;
    deadline: string; // ISO time format
    finished: boolean;
    editable?: boolean;
    createdAt: string;
    updatedAt: string;
    __index?: number; // need for correct rendering
}

export interface ITask extends IBaseTask {
    id: number;
    stages: IStage[];
    templates: ITemplate[];
    marketplace: IMarketPlace;
}

export interface IAnswer {
    answer: string;
    answerType: EPuzzleType;
    comment?: string;
    id: number;
    idPuzzle: string;
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

export interface IMarketPlace {
    region: string;
    city: string;
    format: string;
    address: string;
}

export interface ITaskDocument {
    id: number;
    originalName: string;
    filename: string;
}

export interface IExtendedTask extends IBaseTask {
    id: number;
    templates: Array<ITemplateDocument & IExtendedDocument>;
    stages: IStage[];
    documents: ITaskDocument[];
    marketplace: IMarketPlace;
}
