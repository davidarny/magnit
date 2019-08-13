import * as React from "react";
import { IService, IServiceOptions } from "./IService";
import { IPuzzle, IValidation, TChangeEvent } from "entities";

export interface IRightHandPuzzleBuilder {
    setRightHandPuzzleChangeHandler(
        handler: (event: TChangeEvent) => void,
    ): IRightHandPuzzleBuilder;

    setValueChangeHandler(handler: (event: TChangeEvent) => void): IRightHandPuzzleBuilder;

    setValueBlurHandler(handler: () => void): IRightHandPuzzleBuilder;

    build(validation: IValidation, value: number): React.ReactNode;
}

export interface IValidationService extends IService {
    getOperatorVariants(): React.ReactNode;

    getValidationVariants(): React.ReactNode;

    getRightHandPuzzle(questions: IPuzzle[]): IRightHandPuzzleBuilder;
}

export interface IValidationServiceOptions extends IServiceOptions {
    validation: IValidation;
}
