import {
    EActionType,
    EConditionType,
    EOperatorType,
    EPuzzleType,
    ETemplateType,
    EValidationType,
} from "../enums";

export interface ICondition {
    id: string;
    order: number;
    questionPuzzle: IPuzzle["id"];
    answerPuzzle?: IPuzzle["id"];
    value?: string;
    actionType: EActionType;
    conditionType: EConditionType;
}

export interface IValidation {
    id: string;
    order: number;
    leftHandPuzzle: IPuzzle["id"];
    rightHandPuzzle?: IPuzzle["id"];
    value?: number;
    operatorType: EOperatorType;
    validationType: EValidationType;
    conditionType: EConditionType;
    errorMessage: string;
}

export interface ITemplate {
    id: number;
    title: string;
    description: string;
    sections: ISection[];
    type: ETemplateType;
}

export interface ISection {
    id: string;
    order: number;
    title: string;
    puzzles: IPuzzle[];
    description: string;
}

export interface IPuzzle {
    id: string;
    puzzles: IPuzzle[];
    description: string;
    title: string;
    order: number;
    puzzleType: EPuzzleType;
    conditions: ICondition[];
    validations: IValidation[];
}

export interface ISpecificPuzzleProps {
    index: number;
    puzzle: IPuzzle;

    onTemplateChange?(): void;
}

export interface IFocusedPuzzleProps extends ISpecificPuzzleProps {
    focused: boolean;
}
