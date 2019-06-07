import { EPuzzleType } from "./EPuzzleType";
import { EValidationType } from "./EValidationType";
import { EOperatorType } from "./EOperatorType";
import { EConditionType } from "./EConditionType";
import { EActionType } from "./EActionType";

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

interface ICondition extends IOrdered {
    parentPuzzle: IPuzzle["id"];
    childPuzzle: IPuzzle["id"];
    actionType: EActionType;
    conditionType: EConditionType;
}

interface IValidation extends IOrdered {
    leftHandPuzzle: IPuzzle["id"];
    rightHandPuzzle?: IPuzzle["id"];
    value?: number;
    operatorType: EOperatorType;
    validationType: EValidationType;
    errorMessage: string;
}

export interface ITemplate extends ITitled, IWithId {
    description: string;
    sections: ISection[];
}

export interface ISection extends IOrdered, ITitled, IWithPuzzles<IPuzzle>, IWithId {
    puzzles: IPuzzle[];
}

export interface IPuzzle
    extends IOrdered,
        ITitled,
        IWithPuzzles<IPuzzle>,
        IWithId,
        IWithConditions<ICondition>,
        IWithValidation<IValidation> {
    puzzleType: EPuzzleType;
}

export interface ISpecificPuzzleProps {
    index: number;
}

export * from "./EPuzzleType";
export * from "./EValidationType";
export * from "./EOperatorType";
export * from "./EConditionType";
export * from "./EActionType";
