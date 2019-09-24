import { EConditionType, EPuzzleType, IPuzzle, ISection, IValidation } from "@magnit/entities";
import { IUseConditionsService, useCommonConditionsLogic } from "hooks/condition-common";
import _ from "lodash";
import { default as React, useCallback, useMemo, useRef, useState } from "react";
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
    IPuzzle[],
    string,
    (id: string) => void,
    (id: string, nextValidation: Partial<IValidation>) => void,
    () => void,
    (event: TSelectChangeEvent) => void,
    () => void,
] {
    const defaultState = useRef({
        id: uuid(),
        order: 0,
        leftHandPuzzle: "",
        errorMessage: "",
        operatorType: "",
        validationType: "",
        conditionType: EConditionType.OR,
    });
    const { validations } = puzzle;

    const [errorMessage, setErrorMessage] = useState<string>("");

    const useConditionService: IUseConditionsService<IValidation> = useMemo(
        () => ({
            checkDependentQuestionChanged(leftQuestion: IPuzzle, rightQuestion: IPuzzle): boolean {
                return !_.isEqual(
                    _.omit(leftQuestion, "validations"),
                    _.omit(rightQuestion, "validations"),
                );
            },

            setConditions(conditions: IValidation[]) {
                if (conditions.length === 0) {
                    conditions.push(defaultState.current);
                }
                puzzle.validations = [...validations];
            },

            getConditions(): IValidation[] {
                return validations;
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

            onConditionsChange(): void {
                puzzle.validations = [...validations].filter(
                    validation =>
                        !!(
                            validation.validationType &&
                            validation.conditionType &&
                            validation.operatorType &&
                            validation.errorMessage &&
                            (validation.rightHandPuzzle || validation.value)
                        ),
                );
            },

            shouldSetQuestions(puzzle: IPuzzle): boolean {
                return (puzzle.puzzles || []).every(
                    child => child.puzzleType === EPuzzleType.NUMERIC_ANSWER,
                );
            },
        }),
        [puzzle.validations, validations],
    );

    const [questions] = useCommonConditionsLogic<IValidation>(
        puzzle,
        puzzles,
        parent,
        useConditionService,
    );

    const onDeleteValidationCallback = useCallback(
        (id: string) => {
            // do not allow to delete if only one validation present
            if (validations.length === 1) {
                puzzle.validations = [defaultState.current];
                return;
            }
            puzzle.validations = [...validations.filter(validation => validation.id !== id)];
            useConditionService.onConditionsChange();
        },
        [puzzle.validations, useConditionService, validations],
    );

    const onValidationChangeCallback = useCallback(
        (id: string, nextValidation: Partial<IValidation>): void => {
            const changedValidationIdx = validations.findIndex(validation => validation.id === id);
            validations[changedValidationIdx] = {
                ...validations[changedValidationIdx],
                ...nextValidation,
            };
            puzzle.validations = [...validations];
            useConditionService.onConditionsChange();
        },
        [puzzle.validations, useConditionService, validations],
    );

    const onAddValidationCallback = useCallback((): void => {
        if (
            validations.length !== 0 &&
            !validations.some(validation => !!validation.leftHandPuzzle)
        ) {
            return;
        }
        validations.push({
            ...defaultState.current,
            // copy error message
            errorMessage: (_.first(validations) || { errorMessage: "" }).errorMessage,
            id: uuid(),
            order: validations.length - 1,
            leftHandPuzzle: puzzle.id,
        });
        puzzle.validations = [...validations];
        useConditionService.onConditionsChange();
    }, [puzzle.id, puzzle.validations, useConditionService, validations]);

    function onErrorMessageChange(event: TSelectChangeEvent) {
        setErrorMessage(event.target.value as string);
    }

    const onErrorMessageBlurCallback = useCallback(() => {
        const firstValidation = _.first(validations);
        if (firstValidation) {
            firstValidation.errorMessage = errorMessage;
        }
        puzzle.validations = [...validations.map(validation => ({ ...validation, errorMessage }))];
        useConditionService.onConditionsChange();
    }, [errorMessage, puzzle.validations, useConditionService, validations]);

    return [
        questions,
        errorMessage,
        onDeleteValidationCallback,
        onValidationChangeCallback,
        onAddValidationCallback,
        onErrorMessageChange,
        onErrorMessageBlurCallback,
    ];
}
