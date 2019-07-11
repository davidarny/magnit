import * as React from "react";
import { ICondition, IPuzzle, TChangeEvent } from "entities";
import { EPuzzleType } from "components/puzzle";
import { IService, IServiceOptions } from "./IService";

export type TGetAnswerPuzzleResult =
    | ((onValueChange: (event: TChangeEvent) => void) => React.ReactNode)
    | (() => React.ReactNode)
    | ((onAnswerPuzzleChange: (event: TChangeEvent) => void) => React.ReactNode);

export interface IConditionsService extends IService {
    getActionVariants(): React.ReactNode;

    getAnswerPuzzle(answers: IPuzzle[], questions: IPuzzle[]): TGetAnswerPuzzleResult;
}

export interface IConditionsServiceOptions extends IServiceOptions {
    puzzleType: EPuzzleType;
    condition: ICondition;
}
