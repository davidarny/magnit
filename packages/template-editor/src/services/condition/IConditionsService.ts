import * as React from "react";
import { ICondition, IPuzzle, TChangeEvent } from "entities";
import { EPuzzleType } from "@magnit/services";
import { IService, IServiceOptions } from "./IService";

export interface IAnswerPuzzleBuilder {
    setAnswerPuzzleChangeHandler(handler: (event: TChangeEvent) => void): IAnswerPuzzleBuilder;

    setValueChangeHandler(handler: (event: TChangeEvent) => void): IAnswerPuzzleBuilder;

    setValueBlurHandler(handler: () => void): IAnswerPuzzleBuilder;

    build(): React.ReactNode;
}

export interface IConditionsService extends IService {
    getActionVariants(): React.ReactNode;

    getAnswerPuzzle(answers: IPuzzle[], questions: IPuzzle[]): IAnswerPuzzleBuilder;
}

export interface IConditionsServiceOptions extends IServiceOptions {
    puzzleType: EPuzzleType;
    condition: ICondition;
    value: string;
}
