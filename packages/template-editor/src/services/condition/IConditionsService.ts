import { EPuzzleType, ICondition, IPuzzle } from "@magnit/entities";
import * as React from "react";
import { IService, IServiceOptions } from "./IService";

type TSelectChangeEvent = React.ChangeEvent<{
    name?: string;
    value: unknown;
}>;

export interface IAnswerPuzzleBuilder {
    setAnswerPuzzleChangeHandler(
        handler: (event: TSelectChangeEvent) => void,
    ): IAnswerPuzzleBuilder;

    setValueChangeHandler(handler: (event: TSelectChangeEvent) => void): IAnswerPuzzleBuilder;

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
