import * as React from "react";
import { IService, IServiceOptions } from "./IService";
import { IPuzzle, IValidation, TChangeEvent } from "entities";

export type TGetRightHandPuzzleResult =
    | ((onRightHandPuzzleChange: (event: TChangeEvent) => void) => any)
    | ((onValueChange: (event: TChangeEvent) => void) => any);

export interface IValidationService extends IService {
    getOperatorVariants(): React.ReactNode;

    getValidationVariants(): React.ReactNode;

    getRightHandPuzzle(questions: IPuzzle[]): TGetRightHandPuzzleResult;
}

export interface IValidationServiceOptions extends IServiceOptions {
    validation: IValidation;
}
