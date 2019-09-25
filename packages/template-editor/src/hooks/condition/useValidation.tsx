/** @jsx jsx */

import { jsx } from "@emotion/core";
import { InputField, SelectField } from "@magnit/components";
import {
    EConditionType,
    EOperatorType,
    EValidationType,
    IPuzzle,
    IValidation,
} from "@magnit/entities";
import { NarrowCallside } from "@magnit/services";
import { MenuItem } from "@material-ui/core";
import { useCommonConditionLogic } from "hooks/condition-common";
import { default as React, useCallback } from "react";

type TSelectChangeEvent = React.ChangeEvent<{
    name?: string;
    value: unknown;
}>;

export interface IRightHandPuzzleBuilder {
    setRightHandPuzzleChangeHandler(handler: (event: TSelectChangeEvent) => void): this;

    setValueChangeHandler(handler: (event: TSelectChangeEvent) => void): this;

    setValueBlurHandler(handler: () => void): this;

    build(): React.ReactNode;
}

export function useValidation(
    validation: IValidation,
    value: number,
    index: number,
    conditionType: EConditionType,
    puzzleId: string,
): [
    () => string,
    () => React.ReactNode[],
    (questions: IPuzzle[]) => NarrowCallside<IRightHandPuzzleBuilder>,
    () => React.ReactNode[],
] {
    const [getConditionLiteral] = useCommonConditionLogic(index, conditionType);

    function getValidationLiteral(validationType: EValidationType) {
        return {
            [EValidationType.COMPARE_WITH_ANSWER]: "Сравнить с ответом",
            [EValidationType.SET_VALUE]: "Установить значение",
        }[validationType];
    }

    function getOperatorLiteral(operatorType: EOperatorType) {
        return {
            [EOperatorType.MORE_THAN]: "Больше чем",
            [EOperatorType.LESS_THAN]: "Меньше чем",
            [EOperatorType.LESS_OR_EQUAL]: "Меньше или равно",
            [EOperatorType.MORE_OR_EQUAL]: "Больше или равно",
            [EOperatorType.EQUAL]: "Равно",
        }[operatorType];
    }

    function getOperatorVariants() {
        return [
            <MenuItem
                className={`select__sentinel__${puzzleId}`}
                key={EOperatorType.EQUAL}
                value={EOperatorType.EQUAL}
            >
                {getOperatorLiteral(EOperatorType.EQUAL)}
            </MenuItem>,
            <MenuItem
                className={`select__sentinel__${puzzleId}`}
                key={EOperatorType.MORE_THAN}
                value={EOperatorType.MORE_THAN}
            >
                {getOperatorLiteral(EOperatorType.MORE_THAN)}
            </MenuItem>,
            <MenuItem
                className={`select__sentinel__${puzzleId}`}
                key={EOperatorType.LESS_THAN}
                value={EOperatorType.LESS_THAN}
            >
                {getOperatorLiteral(EOperatorType.LESS_THAN)}
            </MenuItem>,
            <MenuItem
                className={`select__sentinel__${puzzleId}`}
                key={EOperatorType.MORE_OR_EQUAL}
                value={EOperatorType.MORE_OR_EQUAL}
            >
                {getOperatorLiteral(EOperatorType.MORE_OR_EQUAL)}
            </MenuItem>,
            <MenuItem
                className={`select__sentinel__${puzzleId}`}
                key={EOperatorType.LESS_OR_EQUAL}
                value={EOperatorType.LESS_OR_EQUAL}
            >
                {getOperatorLiteral(EOperatorType.LESS_OR_EQUAL)}
            </MenuItem>,
        ];
    }

    const getRightHandPuzzle = useCallback(
        (questions: IPuzzle[]): NarrowCallside<IRightHandPuzzleBuilder> => {
            return new (class implements IRightHandPuzzleBuilder {
                private onRightHandPuzzleChange?: (event: TSelectChangeEvent) => void;
                private onValueChange?: (event: TSelectChangeEvent) => void;
                private onValueBlur?: () => void;

                build(): React.ReactNode {
                    const { validationType, rightHandPuzzle } = validation;
                    if (validationType === EValidationType.COMPARE_WITH_ANSWER) {
                        return (
                            <SelectField
                                fullWidth
                                placeholder="Выберите вопрос"
                                onChange={this.onRightHandPuzzleChange}
                                value={rightHandPuzzle}
                            >
                                {questions.length !== 0 &&
                                    questions.map(question => {
                                        return (
                                            <MenuItem
                                                className={`select__sentinel__${puzzleId}`}
                                                key={question.id}
                                                value={question.id}
                                            >
                                                {question.title}
                                            </MenuItem>
                                        );
                                    })}
                            </SelectField>
                        );
                    } else if (validationType === EValidationType.SET_VALUE) {
                        return (
                            <InputField
                                fullWidth
                                value={value}
                                onChange={this.onValueChange}
                                onBlur={this.onValueBlur}
                                css={theme => ({ marginTop: theme.spacing(-2) })}
                                placeholder="Ответ"
                            />
                        );
                    } else {
                        return <React.Fragment />;
                    }
                }

                setRightHandPuzzleChangeHandler(
                    handler: (event: TSelectChangeEvent) => void,
                ): this {
                    this.onRightHandPuzzleChange = handler;
                    return this;
                }

                setValueBlurHandler(handler: () => void): this {
                    this.onValueBlur = handler;
                    return this;
                }

                setValueChangeHandler(handler: (event: TSelectChangeEvent) => void): this {
                    this.onValueChange = handler;
                    return this;
                }
            })();
        },
        [puzzleId, validation, value],
    );

    const getValidationVariants = () => {
        return [
            <MenuItem
                key={EValidationType.COMPARE_WITH_ANSWER}
                value={EValidationType.COMPARE_WITH_ANSWER}
            >
                {getValidationLiteral(EValidationType.COMPARE_WITH_ANSWER)}
            </MenuItem>,
            <MenuItem key={EValidationType.SET_VALUE} value={EValidationType.SET_VALUE}>
                {getValidationLiteral(EValidationType.SET_VALUE)}
            </MenuItem>,
        ];
    };

    return [getConditionLiteral, getOperatorVariants, getRightHandPuzzle, getValidationVariants];
}
