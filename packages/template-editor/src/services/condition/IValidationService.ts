import { IPuzzle, IValidation } from "@magnit/entities";
import * as React from "react";
import { IService, IServiceOptions } from "./IService";

type TSelectChangeEvent = React.ChangeEvent<{
    name?: string;
    value: unknown;
}>;

export interface IRightHandPuzzleBuilder {
    setRightHandPuzzleChangeHandler(
        handler: (event: TSelectChangeEvent) => void,
    ): IRightHandPuzzleBuilder;

    setValueChangeHandler(handler: (event: TSelectChangeEvent) => void): IRightHandPuzzleBuilder;

    setValueBlurHandler(handler: () => void): IRightHandPuzzleBuilder;

    build(): React.ReactNode;
}

export interface IValidationService extends IService {
    getOperatorVariants(): React.ReactNode;

    getValidationVariants(): React.ReactNode;

    getRightHandPuzzle(questions: IPuzzle[]): IRightHandPuzzleBuilder;
}

export interface IValidationServiceOptions extends IServiceOptions {
    validation: IValidation;
    value: number;
}
