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

    return (
        <Grid container direction="column">
            {conditions.map((condition, index) => {
                const getConditionType = R.prop("conditionType");
                const getActionType = R.prop("actionType");
                const getQuestionPuzzleType = R.path<EPuzzleType>(["questionPuzzle", "puzzleType"]);

                return (
                    <Grid item key={index}>
                        <Grid
                            container
                            spacing={4}
                            alignItems={"center"}
                            css={css`
                                position: relative;
                            `}
                        >
                            <Grid item>
                                {getConditionLiteral(index, getConditionType(condition))}
                            </Grid>
                            <Grid
                                item
                                css={css`
                                    flex-grow: 1;
                                `}
                            >
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="question-puzzle">
                                        Выберите вопрос
                                    </InputLabel>
                                    <Select
                                        value={condition.questionPuzzle}
                                        input={<Input id="question-puzzle" />}
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
                            {questions.length !== 0 && (
                                <React.Fragment>
                                    <Grid
                                        item
                                        css={css`
                                            flex-grow: 1;
                                        `}
                                    >
                                        <FormControl fullWidth>
                                            <InputLabel htmlFor="action-type">
                                                Выберите значение
                                            </InputLabel>
                                            <Select
                                                value={condition.actionType}
                                                input={<Input id="action-type" />}
                                            >
                                                {getActionVariants(
                                                    getQuestionPuzzleType(condition)!
                                                )}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid
                                        item
                                        css={css`
                                            flex-grow: 1;
                                        `}
                                    >
                                        {getAnswerPuzzle(
                                            getActionType(condition),
                                            condition,
                                            answers
                                        )}
                                    </Grid>
                                </React.Fragment>
                            )}
                            {/* hack to have close button at the end */}
                            {questions.length === 0 && (
                                <React.Fragment>
                                    <Grid
                                        item
                                        css={css`
                                            flex-grow: 1;
                                        `}
                                    />
                                    <Grid
                                        item
                                        css={css`
                                            flex-grow: 1;
                                        `}
                                    />
                                </React.Fragment>
                            )}
                            <Grid item>
                                <IconButton onClick={() => onConditionDelete(condition.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Grid>
                );
            })}
            <Grid item css={theme => ({ marginTop: theme.spacing(2) })}>
                <Button
                    size="small"
                    css={css`
                        text-transform: none;
                    `}
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
                <MenuItem key={EActionType.EQUAL}>{getActionLiteral(EActionType.EQUAL)}</MenuItem>,
                <MenuItem key={EActionType.LESS_THAN}>
                    {getActionLiteral(EActionType.LESS_THAN)}
                </MenuItem>,
                <MenuItem key={EActionType.MORE_THAN}>
                    {getActionLiteral(EActionType.MORE_THAN)}
                </MenuItem>,
                <MenuItem key={EActionType.NOT_EQUAL}>
                    {getActionLiteral(EActionType.NOT_EQUAL)}
                </MenuItem>,
            ];
        case EPuzzleType.DROPDOWN_ANSWER:
        case EPuzzleType.RADIO_ANSWER:
            return [
                <MenuItem key={EActionType.CHOSEN_ANSWER}>
                    {getActionLiteral(EActionType.CHOSEN_ANSWER)}
                </MenuItem>,
                <MenuItem key={EActionType.GIVEN_ANSWER}>
                    {getActionLiteral(EActionType.GIVEN_ANSWER)}
                </MenuItem>,
            ];
        default:
            return [
                <MenuItem key={EActionType.EQUAL}>{getActionLiteral(EActionType.EQUAL)}</MenuItem>,
                <MenuItem key={EActionType.LESS_THAN}>
                    {getActionLiteral(EActionType.LESS_THAN)}
                </MenuItem>,
                <MenuItem key={EActionType.MORE_THAN}>
                    {getActionLiteral(EActionType.MORE_THAN)}
                </MenuItem>,
                <MenuItem key={EActionType.NOT_EQUAL}>
                    {getActionLiteral(EActionType.NOT_EQUAL)}
                </MenuItem>,
                <MenuItem key={EActionType.CHOSEN_ANSWER}>
                    {getActionLiteral(EActionType.CHOSEN_ANSWER)}
                </MenuItem>,
                <MenuItem key={EActionType.GIVEN_ANSWER}>
                    {getActionLiteral(EActionType.GIVEN_ANSWER)}
                </MenuItem>,
            ];
    }
}

function getAnswerPuzzle(
    actionType: EActionType,
    condition: ICondition,
    answers: IPuzzle[]
): React.ReactNode {
    switch (actionType) {
        case EActionType.CHOSEN_ANSWER:
            return (
                <FormControl fullWidth>
                    <InputLabel htmlFor="answer-puzzle">Выберите значение</InputLabel>
                    <Select value={condition.answerPuzzle} input={<Input id="answer-puzzle" />}>
                        {answers.map(answer => {
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
        case EActionType.EQUAL:
        case EActionType.LESS_THAN:
        case EActionType.MORE_THAN:
        case EActionType.NOT_EQUAL:
            return <TextField css={theme => ({ marginTop: theme.spacing(-2) })} label="Ответ" />;
        case EActionType.GIVEN_ANSWER:
        default:
            return <React.Fragment />;
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
        return "ЕСли";
    }
    return {
        [EConditionType.AND]: "И",
        [EConditionType.OR]: "Или",
    }[conditionType];
}
