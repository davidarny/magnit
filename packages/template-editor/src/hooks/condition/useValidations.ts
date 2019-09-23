import { EConditionType, EPuzzleType, IPuzzle, ITemplate, IValidation } from "@magnit/entities";
import { IUseConditionsService, useCommonConditionsLogic } from "hooks/condition-common";
import _ from "lodash";
import { default as React, useCallback, useEffect, useRef, useState } from "react";
import { traverse } from "services/json";
import uuid from "uuid/v4";

type TSelectChangeEvent = React.ChangeEvent<{
    name?: string;
    value: unknown;
}>;

export function useValidations(
    template: ITemplate,
    disabled: boolean,
    puzzleId: string,
    onTemplateChange: (template: ITemplate) => void,
    initialState?: IValidation[],
): [
    IValidation[],
    IPuzzle[],
    IPuzzle | null,
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
    const [validations, setValidations] = useState<IValidation[]>(
        _.isArray(initialState) && !_.isEmpty(initialState) ? initialState : [defaultState.current],
    );
    const [errorMessage, setErrorMessage] = useState<string>(
        _.get(_.first(validations), "errorMessage", ""),
    );
    const [currentQuestion, setCurrentQuestion] = useState<IPuzzle | null>(null);

    const useConditionService: IUseConditionsService<IValidation> = {
        checkDependentQuestionChanged(leftQuestion: IPuzzle, rightQuestion: IPuzzle): boolean {
            return !_.isEqual(
                _.omit(leftQuestion, "validations"),
                _.omit(rightQuestion, "validations"),
            );
        },

        getConditionObjects(): IValidation[] {
            return validations;
        },

        getRightPuzzle(validation: IValidation): string {
            return validation.rightHandPuzzle!;
        },

        resetConditionObject(validation: IValidation): void {
            validation.rightHandPuzzle = undefined;
            validation.value = undefined;
            validation.operatorType = "";
            validation.validationType = "";
        },

        setPuzzleConditionObjects(puzzle: IPuzzle, index: number): void {
            puzzle.puzzles[index].validations = [...validations].filter(
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
    };

    const [questions] = useCommonConditionsLogic<IValidation>(
        template,
        disabled,
        puzzleId,
        useConditionService,
        onTemplateChange,
    );

    // get current question
    const prevValidations = useRef(_.cloneDeep(validations));
    useEffect(() => {
        if (disabled) {
            return;
        }
        traverse(template, (value: IPuzzle) => {
            if (!_.has(value, "puzzles") || !_.has(value, "id") || value.id !== puzzleId) {
                return;
            }
            setCurrentQuestion(value);
            const nextValidations = validations.map(validation => ({
                ...validation,
                leftHandPuzzle: value.id,
            }));
            if (!_.isEqual(prevValidations.current, nextValidations)) {
                prevValidations.current = _.cloneDeep(nextValidations);
                setValidations([...nextValidations]);
            }
        });
    }, [template, disabled, puzzleId, validations]);

    const onDeleteValidationCallback = useCallback(
        (id: string) => {
            // do not allow to delete if only one validation present
            if (validations.length === 1) {
                setValidations([defaultState.current]);
                return;
            }
            setValidations([...validations.filter(validation => validation.id !== id)]);
        },
        [defaultState, validations],
    );

    const onValidationChangeCallback = useCallback(
        (id: string, nextValidation: Partial<IValidation>): void => {
            const changedValidationIdx = validations.findIndex(validation => validation.id === id);
            validations[changedValidationIdx] = {
                ...validations[changedValidationIdx],
                ...nextValidation,
            };
            setValidations([...validations]);
        },
        [validations],
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
            leftHandPuzzle: (currentQuestion && currentQuestion.id) || "",
        });
        setValidations([...validations]);
    }, [currentQuestion, validations]);

    function onErrorMessageChange(event: TSelectChangeEvent) {
        setErrorMessage(event.target.value as string);
    }

    const onErrorMessageBlurCallback = useCallback(() => {
        const firstValidation = _.first(validations);
        if (firstValidation) {
            firstValidation.errorMessage = errorMessage;
        }
        setValidations([...validations.map(validation => ({ ...validation, errorMessage }))]);
    }, [errorMessage, validations]);

    return [
        validations,
        questions,
        currentQuestion,
        errorMessage,
        onDeleteValidationCallback,
        onValidationChangeCallback,
        onAddValidationCallback,
        onErrorMessageChange,
        onErrorMessageBlurCallback,
    ];
}
