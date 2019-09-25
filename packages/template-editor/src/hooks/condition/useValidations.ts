import { EConditionType, EPuzzleType, IPuzzle, ISection, IValidation } from "@magnit/entities";
import { IUseConditionsService, useCommonConditionsLogic } from "hooks/condition-common";
import _ from "lodash";
import { default as React, useCallback, useMemo, useState } from "react";
import uuid from "uuid/v4";

type TSelectChangeEvent = React.ChangeEvent<{
    name?: string;
    value: unknown;
}>;

export function useValidations(
    puzzle: IPuzzle,
    puzzles: Map<string, IPuzzle>,
    disabled: boolean,
    onTemplateChange: () => void,
    parent: IPuzzle | ISection,
): [
    IValidation | null,
    IPuzzle[],
    string,
    (id: string) => void,
    (id: string, update: IValidation) => void,
    () => void,
    (event: TSelectChangeEvent) => void,
    () => void,
    (event: MouseEvent) => void,
] {
    const [errorMessage, setErrorMessage] = useState<string>(
        _.get(_.first(puzzle.validations), "errorMessage", ""),
    );

    const useConditionService = useMemo<IUseConditionsService<IValidation>>(
        () => ({
            getVirtualCondition() {
                return {
                    id: uuid(),
                    order: 0,
                    leftHandPuzzle: "",
                    errorMessage: "",
                    operatorType: "",
                    validationType: "",
                    conditionType: EConditionType.OR,
                };
            },

            checkDependentQuestionChanged(leftQuestion: IPuzzle, rightQuestion: IPuzzle): boolean {
                return !_.isEqual(
                    _.omit(leftQuestion, "validations"),
                    _.omit(rightQuestion, "validations"),
                );
            },

            setConditions(conditions: IValidation[]) {
                puzzle.validations = [...conditions];
            },

            getConditions(): IValidation[] {
                return puzzle.validations;
            },

            getRightPuzzle(validation: IValidation): string {
                return validation.rightHandPuzzle!;
            },

            resetConditions(validation: IValidation): void {
                validation.rightHandPuzzle = undefined;
                validation.value = undefined;
                validation.operatorType = "";
                validation.validationType = "";
                validation.errorMessage = "";
                setErrorMessage("");
            },

            filterConditions(virtualCondition: IValidation | null): IValidation[] {
                return [...puzzle.validations, virtualCondition].filter<IValidation>(
                    (validation): validation is IValidation =>
                        !_.isNil(validation) &&
                        !!(
                            validation.validationType &&
                            validation.conditionType &&
                            validation.operatorType &&
                            validation.errorMessage &&
                            (validation.rightHandPuzzle || validation.value)
                        ),
                );
            },

            onConditionsChange(virtualCondition: IValidation | null): void {
                puzzle.validations = this.filterConditions(virtualCondition);
                onTemplateChange();
            },

            shouldSetQuestions(puzzle: IPuzzle): boolean {
                return (puzzle.puzzles || []).every(
                    child => child.puzzleType === EPuzzleType.NUMERIC_ANSWER,
                );
            },
        }),
        [onTemplateChange, puzzle.validations],
    );

    const [
        questions,
        ,
        virtualCondition,
        ,
        onValidationDelete,
        onValidationChange,
        onAddValidation,
        onValidationsBlur,
    ] = useCommonConditionsLogic<IValidation>(
        disabled,
        puzzle,
        puzzles,
        parent,
        useConditionService,
        onTemplateChange,
    );

    const onDeleteValidationCallback = useCallback(
        (id: string) => {
            onValidationDelete(id);
        },
        [onValidationDelete],
    );

    const onValidationChangeCallback = useCallback(
        (id: string, update: IValidation): void => {
            onValidationChange(id, update);
        },
        [onValidationChange],
    );

    const onAddValidationCallback = useCallback((): void => {
        onAddValidation(last => ({
            id: uuid(),
            errorMessage: last.errorMessage,
            order: last.order + 1,
            leftHandPuzzle: last.leftHandPuzzle,
        }));
    }, [onAddValidation]);

    function onErrorMessageChange(event: TSelectChangeEvent) {
        setErrorMessage(event.target.value as string);
    }

    const onErrorMessageBlurCallback = useCallback(() => {
        const firstValidation = _.first(puzzle.validations);
        if (firstValidation) {
            firstValidation.errorMessage = errorMessage;
        }
        puzzle.validations = [
            ...puzzle.validations.map(validation => ({ ...validation, errorMessage })),
        ];
        useConditionService.onConditionsChange(virtualCondition);
    }, [errorMessage, puzzle.validations, useConditionService, virtualCondition]);

    return [
        virtualCondition,
        questions,
        errorMessage,
        onDeleteValidationCallback,
        onValidationChangeCallback,
        onAddValidationCallback,
        onErrorMessageChange,
        onErrorMessageBlurCallback,
        onValidationsBlur,
    ];
}
