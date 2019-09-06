/** @jsx jsx */

import { jsx } from "@emotion/core";
import { InputField, SelectField } from "@magnit/components";
import { EActionType, EPuzzleType, ETerminals, IPuzzle } from "@magnit/entities";
import { MenuItem } from "@material-ui/core";
import * as React from "react";
import {
    IAnswerPuzzleBuilder,
    IConditionsService,
    IConditionsServiceOptions,
} from "./IConditionsService";
import { ServiceImpl } from "./ServiceImpl";

type TSelectChangeEvent = React.ChangeEvent<{
    name?: string;
    value: unknown;
}>;

export class ConditionService extends ServiceImpl implements IConditionsService {
    constructor(protected readonly options: IConditionsServiceOptions) {
        super({ conditionType: options.condition.conditionType, ...options });
    }

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

    getAnswerPuzzle(answers: IPuzzle[], questions: IPuzzle[]): IAnswerPuzzleBuilder {
        const self = this;
        return new (class implements IAnswerPuzzleBuilder {
            private onAnswerPuzzleChange?: (event: TSelectChangeEvent) => void;
            private onValueChange?: (event: TSelectChangeEvent) => void;
            private onValueBlur?: () => void;

            build(): React.ReactNode {
                const { actionType, answerPuzzle, questionPuzzle } = self.options.condition;
                const { value } = self.options;
                switch (actionType) {
                    case EActionType.CHOSEN_ANSWER:
                        return (
                            <SelectField
                                fullWidth
                                placeholder="Выберите ответ"
                                onChange={this.onAnswerPuzzleChange}
                                value={answerPuzzle || ETerminals.EMPTY}
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
                                                <MenuItem key={answer.id} value={answer.id}>
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
                                value={value || ""}
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

            setAnswerPuzzleChangeHandler(
                handler: (event: TSelectChangeEvent) => void,
            ): IAnswerPuzzleBuilder {
                this.onAnswerPuzzleChange = handler;
                return this;
            }

            setValueChangeHandler(
                handler: (event: TSelectChangeEvent) => void,
            ): IAnswerPuzzleBuilder {
                this.onValueChange = handler;
                return this;
            }

            setValueBlurHandler(handler: () => void): IAnswerPuzzleBuilder {
                this.onValueBlur = handler;
                return this;
            }
        })();
    }
}
