/** @jsx jsx */

import { jsx } from "@emotion/core";
import { InputField, SelectField } from "@magnit/components";
import { EActionType, EConditionType, EPuzzleType, ICondition, IPuzzle } from "@magnit/entities";
import { NarrowCallside } from "@magnit/services";
import { MenuItem } from "@material-ui/core";
import { useCommonConditionLogic } from "hooks/condition-common";
import { default as React, useCallback } from "react";

type TSelectChangeEvent = React.ChangeEvent<{
    name?: string;
    value: unknown;
}>;

export interface IAnswerPuzzleBuilder {
    setAnswerPuzzleChangeHandler(handler: (event: TSelectChangeEvent) => void): this;

    setValueChangeHandler(handler: (event: TSelectChangeEvent) => void): this;

    setValueBlurHandler(handler: () => void): this;

    build(): React.ReactNode;
}

export function useCondition(
    puzzleType: EPuzzleType,
    condition: ICondition,
    value: string,
    index: number,
    conditionType: EConditionType,
    puzzleId: string,
): [
    () => string,
    () => React.ReactNode,
    (answers: IPuzzle[], questions: IPuzzle[]) => NarrowCallside<IAnswerPuzzleBuilder>,
] {
    const [getConditionLiteral] = useCommonConditionLogic(index, conditionType);

    const getActionLiteral = (actionType: EActionType) => {
        return {
            [EActionType.CHOSEN_ANSWER]: "Выбран ответ",
            [EActionType.NOT_EQUAL]: "Не равно",
            [EActionType.MORE_THAN]: "Больше чем",
            [EActionType.LESS_THAN]: "Меньше чем",
            [EActionType.EQUAL]: "Равно",
            [EActionType.GIVEN_ANSWER]: "Дан ответ",
        }[actionType];
    };

    const getActionVariants = useCallback(() => {
        switch (puzzleType) {
            case EPuzzleType.TEXT_ANSWER:
            case EPuzzleType.NUMERIC_ANSWER:
            case EPuzzleType.DATE_ANSWER:
                return [
                    <MenuItem
                        className={`select__sentinel__${puzzleId}`}
                        key={EActionType.EQUAL}
                        value={EActionType.EQUAL}
                    >
                        {getActionLiteral(EActionType.EQUAL)}
                    </MenuItem>,
                    <MenuItem
                        className={`select__sentinel__${puzzleId}`}
                        key={EActionType.LESS_THAN}
                        value={EActionType.LESS_THAN}
                    >
                        {getActionLiteral(EActionType.LESS_THAN)}
                    </MenuItem>,
                    <MenuItem
                        className={`select__sentinel__${puzzleId}`}
                        key={EActionType.MORE_THAN}
                        value={EActionType.MORE_THAN}
                    >
                        {getActionLiteral(EActionType.MORE_THAN)}
                    </MenuItem>,
                    <MenuItem
                        className={`select__sentinel__${puzzleId}`}
                        key={EActionType.NOT_EQUAL}
                        value={EActionType.NOT_EQUAL}
                    >
                        {getActionLiteral(EActionType.NOT_EQUAL)}
                    </MenuItem>,
                    <MenuItem
                        className={`select__sentinel__${puzzleId}`}
                        key={EActionType.GIVEN_ANSWER}
                        value={EActionType.GIVEN_ANSWER}
                    >
                        {getActionLiteral(EActionType.GIVEN_ANSWER)}
                    </MenuItem>,
                ];
            case EPuzzleType.DROPDOWN_ANSWER:
            case EPuzzleType.RADIO_ANSWER:
            case EPuzzleType.CHECKBOX_ANSWER:
                return [
                    <MenuItem
                        className={`select__sentinel__${puzzleId}`}
                        key={EActionType.CHOSEN_ANSWER}
                        value={EActionType.CHOSEN_ANSWER}
                    >
                        {getActionLiteral(EActionType.CHOSEN_ANSWER)}
                    </MenuItem>,
                    <MenuItem
                        className={`select__sentinel__${puzzleId}`}
                        key={EActionType.GIVEN_ANSWER}
                        value={EActionType.GIVEN_ANSWER}
                    >
                        {getActionLiteral(EActionType.GIVEN_ANSWER)}
                    </MenuItem>,
                ];
            default:
                return [
                    <MenuItem
                        className={`select__sentinel__${puzzleId}`}
                        key={EActionType.GIVEN_ANSWER}
                        value={EActionType.GIVEN_ANSWER}
                    >
                        {getActionLiteral(EActionType.GIVEN_ANSWER)}
                    </MenuItem>,
                ];
        }
    }, [puzzleId, puzzleType]);

    const getAnswerPuzzle = useCallback(
        (answers: IPuzzle[], questions: IPuzzle[]): NarrowCallside<IAnswerPuzzleBuilder> => {
            return new (class implements IAnswerPuzzleBuilder {
                private onAnswerPuzzleChange?: (event: TSelectChangeEvent) => void;
                private onValueChange?: (event: TSelectChangeEvent) => void;
                private onValueBlur?: () => void;

                build(): React.ReactNode {
                    const { actionType, answerPuzzle, questionPuzzle } = condition;
                    switch (actionType) {
                        case EActionType.CHOSEN_ANSWER:
                            return (
                                <SelectField
                                    fullWidth
                                    placeholder="Выберите ответ"
                                    onChange={this.onAnswerPuzzleChange}
                                    value={answerPuzzle}
                                >
                                    {answers.length !== 0 &&
                                        answers
                                            .filter(answer => {
                                                // find which question references to current condition
                                                const currentQuestion = questions.find(
                                                    question => questionPuzzle === question.id,
                                                );
                                                if (!currentQuestion) {
                                                    return false;
                                                }
                                                // check if current answer is referenced to found question
                                                // if true then this answer is transition-referenced
                                                // to current condition
                                                // condition -> question -> answer ~ condition -> answer
                                                return currentQuestion.puzzles.some(
                                                    puzzle => puzzle.id === answer.id,
                                                );
                                            })
                                            .map(answer => {
                                                return (
                                                    <MenuItem
                                                        className={`select__sentinel__${puzzleId}`}
                                                        key={answer.id}
                                                        value={answer.id}
                                                    >
                                                        {answer.title}
                                                    </MenuItem>
                                                );
                                            })}
                                </SelectField>
                            );
                        case EActionType.EQUAL:
                        case EActionType.LESS_THAN:
                        case EActionType.MORE_THAN:
                        case EActionType.NOT_EQUAL:
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
                        case EActionType.GIVEN_ANSWER:
                        default:
                            return <React.Fragment />;
                    }
                }

                setAnswerPuzzleChangeHandler(handler: (event: TSelectChangeEvent) => void): this {
                    this.onAnswerPuzzleChange = handler;
                    return this;
                }

                setValueChangeHandler(handler: (event: TSelectChangeEvent) => void): this {
                    this.onValueChange = handler;
                    return this;
                }

                setValueBlurHandler(handler: () => void): this {
                    this.onValueBlur = handler;
                    return this;
                }
            })();
        },
        [condition, puzzleId, value],
    );
    return [getConditionLiteral, getActionVariants, getAnswerPuzzle];
}
