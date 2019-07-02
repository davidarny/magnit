/** @jsx jsx */

import { jsx } from "@emotion/core";
import * as React from "react";
import {
    IConditionsService,
    IConditionsServiceOptions,
    TGetAnswerPuzzleResult,
} from "./IConditionsService";
import { EPuzzleType } from "components/puzzle";
import { EActionType, EConditionType, ETerminals, IPuzzle, TChangeEvent } from "entities";
import { FormControl, Input, InputLabel, MenuItem, Select, TextField } from "@material-ui/core";

export class ConditionService implements IConditionsService {
    constructor(private readonly options: IConditionsServiceOptions) {}

    private static getActionLiteral(actionType: EActionType): string {
        return {
            [EActionType.CHOSEN_ANSWER]: "Выбран ответ",
            [EActionType.NOT_EQUAL]: "Не равно",
            [EActionType.MORE_THAN]: "Больше чем",
            [EActionType.LESS_THAN]: "Меньше чем",
            [EActionType.EQUAL]: "Равно",
            [EActionType.GIVEN_ANSWER]: "Дан ответ",
            [EActionType.NONE]: ETerminals.EMPTY,
        }[actionType];
    }

    getActionVariants(): React.ReactNode {
        switch (this.options.puzzleType) {
            case EPuzzleType.TEXT_ANSWER:
            case EPuzzleType.NUMERIC_ANSWER:
            case EPuzzleType.DATE_ANSWER:
                return [
                    <MenuItem key={EActionType.EQUAL} value={EActionType.EQUAL}>
                        {ConditionService.getActionLiteral(EActionType.EQUAL)}
                    </MenuItem>,
                    <MenuItem key={EActionType.LESS_THAN} value={EActionType.LESS_THAN}>
                        {ConditionService.getActionLiteral(EActionType.LESS_THAN)}
                    </MenuItem>,
                    <MenuItem key={EActionType.MORE_THAN} value={EActionType.MORE_THAN}>
                        {ConditionService.getActionLiteral(EActionType.MORE_THAN)}
                    </MenuItem>,
                    <MenuItem key={EActionType.NOT_EQUAL} value={EActionType.NOT_EQUAL}>
                        {ConditionService.getActionLiteral(EActionType.NOT_EQUAL)}
                    </MenuItem>,
                    <MenuItem key={EActionType.GIVEN_ANSWER} value={EActionType.GIVEN_ANSWER}>
                        {ConditionService.getActionLiteral(EActionType.GIVEN_ANSWER)}
                    </MenuItem>,
                ];
            case EPuzzleType.DROPDOWN_ANSWER:
            case EPuzzleType.RADIO_ANSWER:
            case EPuzzleType.CHECKBOX_ANSWER:
                return [
                    <MenuItem key={EActionType.CHOSEN_ANSWER} value={EActionType.CHOSEN_ANSWER}>
                        {ConditionService.getActionLiteral(EActionType.CHOSEN_ANSWER)}
                    </MenuItem>,
                    <MenuItem key={EActionType.GIVEN_ANSWER} value={EActionType.GIVEN_ANSWER}>
                        {ConditionService.getActionLiteral(EActionType.GIVEN_ANSWER)}
                    </MenuItem>,
                ];
            default:
                return [
                    <MenuItem key={EActionType.GIVEN_ANSWER} value={EActionType.GIVEN_ANSWER}>
                        {ConditionService.getActionLiteral(EActionType.GIVEN_ANSWER)}
                    </MenuItem>,
                ];
        }
    }

    getAnswerPuzzle(answers: IPuzzle[], questions: IPuzzle[]): TGetAnswerPuzzleResult {
        const { condition } = this.options;
        switch (condition.actionType) {
            case EActionType.CHOSEN_ANSWER:
                return (onAnswerPuzzleChange: (event: TChangeEvent) => void) => {
                    return (
                        <FormControl fullWidth>
                            <InputLabel htmlFor="answer-puzzle">Выберите ответ</InputLabel>
                            <Select
                                onChange={onAnswerPuzzleChange}
                                value={condition.answerPuzzle || ETerminals.EMPTY}
                                input={<Input id="answer-puzzle" />}
                            >
                                {answers.length === 0 && (
                                    <MenuItem>Нет доступных вариантов</MenuItem>
                                )}
                                {answers.length !== 0 &&
                                    answers
                                        .filter(answer => {
                                            // find which question references to current condition
                                            const currentQuestion = questions.find(
                                                question => condition.questionPuzzle === question.id
                                            );
                                            if (!currentQuestion) {
                                                return false;
                                            }
                                            // check if current answer is referenced to found question
                                            // if true then this answer is transition-referenced
                                            // to current condition
                                            // condition -> question -> answer ~ condition -> answer
                                            return currentQuestion.puzzles.some(
                                                puzzle => puzzle.id === answer.id
                                            );
                                        })
                                        .map(answer => {
                                            return (
                                                <MenuItem key={answer.id} value={answer.id}>
                                                    {answer.title}
                                                </MenuItem>
                                            );
                                        })}
                            </Select>
                        </FormControl>
                    );
                };
            case EActionType.EQUAL:
            case EActionType.LESS_THAN:
            case EActionType.MORE_THAN:
            case EActionType.NOT_EQUAL:
                return (onValueChange: (event: TChangeEvent) => void) => {
                    return (
                        <TextField
                            value={condition.value}
                            onChange={onValueChange}
                            css={theme => ({ marginTop: theme.spacing(-2) })}
                            label="Ответ"
                        />
                    );
                };
            case EActionType.GIVEN_ANSWER:
            default:
                return () => <React.Fragment />;
        }
    }

    getConditionLiteral(): string {
        if (this.options.index === 0) {
            return "Если";
        }
        return {
            [EConditionType.AND]: "И",
            [EConditionType.OR]: "Или",
        }[this.options.condition.conditionType];
    }
}
