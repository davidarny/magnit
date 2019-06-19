/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import * as React from "react";
import { useEffect, useState } from "react";
import {
    Button,
    FormControl,
    Grid,
    IconButton,
    Input,
    InputLabel,
    MenuItem,
    Select,
    TextField,
} from "@material-ui/core";
import { Close as DeleteIcon } from "@material-ui/icons";
import { EActionType, EConditionType, ICondition, IPuzzle, ITemplate } from "entities";
import { traverse } from "services/json";
import { EPuzzleType } from "components/puzzle";
import * as R from "ramda";
import uuid from "uuid/v4";

interface IConditionsType {
    puzzleId: string;
    template: ITemplate;
}

type TChangeEvent = React.ChangeEvent<{ name?: string; value: unknown }>;

export const Conditions: React.FC<IConditionsType> = ({ puzzleId, template }) => {
    const [conditions, setConditions] = useState<ICondition[]>([
        {
            id: uuid(),
            order: 0,
            questionPuzzle: "",
            answerPuzzle: "",
            value: "",
            actionType: "" as EActionType,
            conditionType: "" as EConditionType,
        },
    ]);
    const [questions, setQuestions] = useState<IPuzzle[]>([]);
    const [answers, setAnswers] = useState<IPuzzle[]>([]);

    useEffect(() => {
        // traverse template and if found question ov
        // of prev group or prev question
        // set childPuzzle & parentPuzzle to those
        questions.length = 0;
        answers.length = 0;
        traverse(template, (value: any) => {
            if (typeof value !== "object" || !("puzzles" in value)) {
                return;
            }
            const puzzle = value as IPuzzle;
            if (!puzzle.puzzles.some(child => child.id === puzzleId)) {
                return;
            }
            const index = puzzle.puzzles.findIndex(child => child.id === puzzleId);
            R.range(0, index).forEach(i => {
                traverse(puzzle.puzzles[i], (value: any) => {
                    if (typeof value !== "object" || !("puzzleType" in value)) {
                        return;
                    }
                    const puzzle = value as IPuzzle;
                    if (puzzle.puzzleType === EPuzzleType.QUESTION && puzzle.title.length > 0) {
                        questions.push(puzzle);
                        return;
                    }
                    const allowedPuzzleTypes = [
                        EPuzzleType.INPUT_ANSWER,
                        EPuzzleType.RADIO_ANSWER,
                        EPuzzleType.DROPDOWN_ANSWER,
                    ];
                    if (allowedPuzzleTypes.includes(puzzle.puzzleType)) {
                        answers.push(puzzle);
                        return;
                    }
                });
            });
        });
        setQuestions([...questions]);
        setAnswers([...answers]);
    }, [questions, template, conditions, puzzleId]);

    function onConditionDelete(id: string) {
        setConditions([...conditions.filter(condition => condition.id !== id)]);
    }

    function onConditionChange(id: string, nextCondition: Partial<ICondition>): void {
        const changedConditionIdx = conditions.findIndex(condition => condition.id === id);
        const prevCondition = conditions[changedConditionIdx];
        const nextConditions = conditions.splice(changedConditionIdx, 1);
        nextConditions[changedConditionIdx] = { ...prevCondition, ...nextCondition };
        setConditions(nextConditions);
    }

    return (
        <Grid container spacing={2} alignItems="flex-end">
            {conditions.map((condition, index) => {
                function onQuestionPuzzleChange(event: TChangeEvent): void {
                    onConditionChange(condition.id, {
                        questionPuzzle: event.target.value as string,
                    });
                }

                function onActionTypeChange(event: TChangeEvent): void {
                    onConditionChange(condition.id, {
                        actionType: event.target.value as EActionType,
                    });
                }

                function onAnswerPuzzleChange(event: TChangeEvent): void {
                    onConditionChange(condition.id, {
                        answerPuzzle: event.target.value as string,
                    });
                }

                function onValueChange(event: TChangeEvent): void {
                    onConditionChange(condition.id, {
                        value: event.target.value as string,
                    });
                }

                const getConditionType = R.prop("conditionType");
                const getActionType = R.prop("actionType");
                const getQuestionPuzzleType = R.path<EPuzzleType>(["questionPuzzle", "puzzleType"]);

                return (
                    <React.Fragment key={condition.id}>
                        <Grid xs={2} item>
                            {getConditionLiteral(index, getConditionType(condition))}
                        </Grid>
                        <Grid item xs={4}>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="question-puzzle">Выберите вопрос</InputLabel>
                                <Select
                                    value={condition.questionPuzzle || ""}
                                    input={<Input id="question-puzzle" />}
                                    onChange={onQuestionPuzzleChange}
                                >
                                    {questions.length === 0 && (
                                        <MenuItem>Нет доступных вариантов</MenuItem>
                                    )}
                                    {questions.map(questionToChoseFrom => {
                                        const value = R.prop("id")(questionToChoseFrom);
                                        const title = R.prop("title")(questionToChoseFrom);
                                        return (
                                            <MenuItem key={value} value={value}>
                                                {title}
                                            </MenuItem>
                                        );
                                    })}
                                </Select>
                            </FormControl>
                        </Grid>
                        {!!condition.questionPuzzle && (
                            <React.Fragment>
                                <Grid item xs={3}>
                                    <FormControl fullWidth>
                                        <InputLabel htmlFor="action-type">
                                            Выберите значение
                                        </InputLabel>
                                        <Select
                                            value={condition.actionType || ""}
                                            input={<Input id="action-type" />}
                                            onChange={onActionTypeChange}
                                        >
                                            {getActionVariants(getQuestionPuzzleType(condition)!)}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={2}>
                                    {getAnswerPuzzle(
                                        getActionType(condition),
                                        condition,
                                        answers,
                                        condition.value
                                    )(
                                        getActionType(condition) === EActionType.CHOSEN_ANSWER
                                            ? onAnswerPuzzleChange
                                            : onValueChange
                                    )}
                                </Grid>
                            </React.Fragment>
                        )}
                        <Grid item xs={!!condition.questionPuzzle ? 1 : 6}>
                            <Grid container justify="flex-end">
                                <Grid item>
                                    <IconButton onClick={() => onConditionDelete(condition.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Grid>
                    </React.Fragment>
                );
            })}
            <Grid item xs={2}>
                <Button
                    size="small"
                    css={css`
                        text-transform: none;
                    `}
                    variant="contained"
                >
                    + Добавить условие
                </Button>
            </Grid>
        </Grid>
    );
};

function getActionVariants(puzzleType: EPuzzleType): React.ReactNode {
    switch (puzzleType) {
        case EPuzzleType.INPUT_ANSWER:
            return [
                <MenuItem key={EActionType.EQUAL} value={EActionType.EQUAL}>
                    {getActionLiteral(EActionType.EQUAL)}
                </MenuItem>,
                <MenuItem key={EActionType.LESS_THAN} value={EActionType.LESS_THAN}>
                    {getActionLiteral(EActionType.LESS_THAN)}
                </MenuItem>,
                <MenuItem key={EActionType.MORE_THAN} value={EActionType.MORE_THAN}>
                    {getActionLiteral(EActionType.MORE_THAN)}
                </MenuItem>,
                <MenuItem key={EActionType.NOT_EQUAL} value={EActionType.NOT_EQUAL}>
                    {getActionLiteral(EActionType.NOT_EQUAL)}
                </MenuItem>,
            ];
        case EPuzzleType.DROPDOWN_ANSWER:
        case EPuzzleType.RADIO_ANSWER:
            return [
                <MenuItem key={EActionType.CHOSEN_ANSWER} value={EActionType.CHOSEN_ANSWER}>
                    {getActionLiteral(EActionType.CHOSEN_ANSWER)}
                </MenuItem>,
                <MenuItem key={EActionType.GIVEN_ANSWER} value={EActionType.GIVEN_ANSWER}>
                    {getActionLiteral(EActionType.GIVEN_ANSWER)}
                </MenuItem>,
            ];
        default:
            return [
                <MenuItem key={EActionType.EQUAL} value={EActionType.EQUAL}>
                    {getActionLiteral(EActionType.EQUAL)}
                </MenuItem>,
                <MenuItem key={EActionType.LESS_THAN} value={EActionType.LESS_THAN}>
                    {getActionLiteral(EActionType.LESS_THAN)}
                </MenuItem>,
                <MenuItem key={EActionType.MORE_THAN} value={EActionType.MORE_THAN}>
                    {getActionLiteral(EActionType.MORE_THAN)}
                </MenuItem>,
                <MenuItem key={EActionType.NOT_EQUAL} value={EActionType.NOT_EQUAL}>
                    {getActionLiteral(EActionType.NOT_EQUAL)}
                </MenuItem>,
                <MenuItem key={EActionType.CHOSEN_ANSWER} value={EActionType.CHOSEN_ANSWER}>
                    {getActionLiteral(EActionType.CHOSEN_ANSWER)}
                </MenuItem>,
                <MenuItem key={EActionType.GIVEN_ANSWER} value={EActionType.GIVEN_ANSWER}>
                    {getActionLiteral(EActionType.GIVEN_ANSWER)}
                </MenuItem>,
            ];
    }
}

function getAnswerPuzzle(
    actionType: EActionType,
    condition: ICondition,
    answers: IPuzzle[],
    value: string
):
    | ((onValueChange: (event: TChangeEvent) => void) => React.ReactNode)
    | (() => React.ReactNode)
    | ((onAnswerPuzzleChange: (event: TChangeEvent) => void) => React.ReactNode) {
    switch (actionType) {
        case EActionType.CHOSEN_ANSWER:
            return (onAnswerPuzzleChange: (event: TChangeEvent) => void) => {
                return (
                    <FormControl fullWidth>
                        <InputLabel htmlFor="answer-puzzle">Выберите ответ</InputLabel>
                        <Select
                            onChange={onAnswerPuzzleChange}
                            value={condition.answerPuzzle || ""}
                            input={<Input id="answer-puzzle" />}
                        >
                            {answers.length === 0 && <MenuItem>Нет доступных вариантов</MenuItem>}
                            {answers.length !== 0 &&
                                answers.map(answer => {
                                    const value = R.prop("id")(answer);
                                    const title = R.prop("title")(answer);
                                    return (
                                        <MenuItem key={value} value={value}>
                                            {title}
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
                        value={value}
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

function getActionLiteral(actionType: EActionType): string {
    return {
        [EActionType.CHOSEN_ANSWER]: "Выбран ответ",
        [EActionType.NOT_EQUAL]: "Не равно",
        [EActionType.MORE_THAN]: "Больше чем",
        [EActionType.LESS_THAN]: "Меньше чем",
        [EActionType.EQUAL]: "Равно",
        [EActionType.GIVEN_ANSWER]: "Дан ответ",
    }[actionType];
}

function getConditionLiteral(index: number, conditionType: EConditionType): string {
    if (index === 0) {
        return "Если";
    }
    return {
        [EConditionType.AND]: "И",
        [EConditionType.OR]: "Или",
    }[conditionType];
}
