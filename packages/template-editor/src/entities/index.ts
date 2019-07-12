import { EValidationType } from "./EValidationType";
import { EOperatorType } from "./EOperatorType";
import { EConditionType } from "./EConditionType";
import { EActionType } from "./EActionType";
import { EPuzzleType } from "components/puzzle";
import * as React from "react";
import { ETemplateType } from "./ETemplateType";

interface ITitled {
    title: string;
}

interface IOrdered {
    order: number;
}

interface IWithId {
    id: string;
}

interface IWithPuzzles<T> {
    puzzles: T[];
}

interface IWithConditions<T> {
    conditions: T[];
}

interface IWithValidation<T> {
    validations: T[];
}

interface IWithDescription {
    description: string;
}

export interface ICondition extends IOrdered, IWithId {
    questionPuzzle: IPuzzle["id"];
    answerPuzzle?: IPuzzle["id"];
    value?: string;
    actionType: EActionType;
    conditionType: EConditionType;
}

export interface IValidation extends IOrdered, IWithId {
    leftHandPuzzle: IPuzzle["id"];
    rightHandPuzzle?: IPuzzle["id"];
    value?: number;
    operatorType: EOperatorType;
    validationType: EValidationType;
    conditionType: EConditionType;
    errorMessage: string;
}

export interface ITemplate extends ITitled, IWithId, IWithDescription {
    sections: ISection[];
    type: ETemplateType;
}

export interface ISection extends IOrdered, ITitled, IWithPuzzles<IPuzzle>, IWithId {}

export interface IPuzzle
    extends IOrdered,
        ITitled,
        IWithPuzzles<IPuzzle>,
        IWithId,
        IWithConditions<ICondition>,
        IWithValidation<IValidation>,
        IWithDescription {
    puzzleType: EPuzzleType;
}

export interface ISpecificPuzzleProps {
    id: string;
    index: number;
}

export interface IFocusedPuzzleProps extends ISpecificPuzzleProps {
    focused: boolean;
}

interface TChangeParam {
    name?: string;
    value: unknown;
}

export type TChangeEvent = React.ChangeEvent<TChangeParam>;

export * from "./EValidationType";
export * from "./EOperatorType";
export * from "./EConditionType";
export * from "./EActionType";
export * from "./ETemplateType";
