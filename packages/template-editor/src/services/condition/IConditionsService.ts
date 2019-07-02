import * as React from "react";
import { ICondition, IPuzzle, TChangeEvent } from "entities";
import { EPuzzleType } from "components/puzzle";

export type TGetAnswerPuzzleResult =
    | ((onValueChange: (event: TChangeEvent) => void) => React.ReactNode)
    | (() => React.ReactNode)
    | ((onAnswerPuzzleChange: (event: TChangeEvent) => void) => React.ReactNode);

export interface IConditionsService {
    getActionVariants(): React.ReactNode;

    getAnswerPuzzle(answers: IPuzzle[], questions: IPuzzle[]): TGetAnswerPuzzleResult;

    getConditionLiteral(): string;
}

export interface IConditionsServiceOptions {
    index: number;
    condition: ICondition;
    puzzleType: EPuzzleType;
}
