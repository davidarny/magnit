/* eslint-disable react-hooks/exhaustive-deps */
/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
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
import { EActionType, EConditionType, ETerminals, ICondition, IPuzzle, ITemplate } from "entities";
import { traverse } from "services/json";
import { EPuzzleType } from "components/puzzle";
import _ from "lodash";
import uuid from "uuid/v4";

interface IConditionsProps {
    puzzleId: string;
    template: ITemplate;

    onTemplateChange(template: ITemplate): void;
}

type TChangeEvent = React.ChangeEvent<{ name?: string; value: unknown }>;

export const Conditions: React.FC<IConditionsProps> = ({ puzzleId, template, ...props }) => {
    const [conditions, setConditions] = useState<ICondition[]>([
        {
            id: uuid(),
            order: 0,
            questionPuzzle: ETerminals.EMPTY,
            answerPuzzle: ETerminals.EMPTY,
            value: ETerminals.EMPTY,
            actionType: EActionType.NONE,
            conditionType: EConditionType.OR,
        },
    ]);
    const [questions, setQuestions] = useState<IPuzzle[]>([]);
    const [answers, setAnswers] = useState<IPuzzle[]>([]);
    const templateSnapshot = useRef<ITemplate>({} as ITemplate);

    useEffect(() => {
        // track if template is changed
        // outside of this component
        if (!_.isEqual(template, templateSnapshot.current)) {
            conditions.forEach((condition, index, array) => {
                let hasDependentQuestionChanged = false;
                const dependentQuestion = questions.find(
                    question => question.id === condition.questionPuzzle
                );
                if (dependentQuestion) {
                    traverse(template, (value: any) => {
                        if (typeof value !== "object" || !("puzzles" in value)) {
                            return;
                        }
                        const puzzle = value as IPuzzle;
                        // find dependent question in template
                        if (
                            !("puzzleType" in puzzle) ||
                            puzzle.puzzleType !== EPuzzleType.QUESTION ||
                            puzzle.id !== dependentQuestion.id
                        ) {
                            return;
                        }
                        // check if dependent question has changed
                        hasDependentQuestionChanged = !_.isEqual(dependentQuestion, puzzle);
                    });
                    if (hasDependentQuestionChanged) {
                        condition.answerPuzzle = ETerminals.EMPTY;
                        condition.value = ETerminals.EMPTY;
                        condition.actionType = EActionType.NONE;
                        array[index] = { ...condition };
                    }
                }
            });
        }
        // fill questions and answers initially
        // by traversing whole template tree
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
            // find index of current puzzle in a tree
            const index = puzzle.puzzles.findIndex(item => item.id === puzzleId);
            // traverse all children of parent puzzle
            // in order to find all possible siblings above
            // so that scope of questionPuzzle is always all puzzles above the current
            _.range(0, index).forEach(i => {
                traverse(puzzle.puzzles[i], (value: any) => {
                    if (typeof value !== "object" || !("puzzleType" in value)) {
                        return;
                    }
                    const puzzle = value as IPuzzle;
                    // if puzzle is question and has non-empty title
                    // then it's allowed to be selected as a questionPuzzle
                    if (puzzle.puzzleType === EPuzzleType.QUESTION && puzzle.title.length > 0) {
                        questions.push(puzzle);
                        return;
                    }
                    // if puzzle is one of answers types
                    // then it's allowed to be selected as an answerPuzzle
                    const excludedPuzzleTypes = [
                        EPuzzleType.GROUP,
                        EPuzzleType.QUESTION,
                        EPuzzleType.UPLOAD_FILES,
                    ];
                    if (!excludedPuzzleTypes.includes(puzzle.puzzleType)) {
                        answers.push(puzzle);
                        return;
                    }
                });
            });
            // set conditions of current puzzle
            puzzle.puzzles[index].conditions = [...conditions];
        });
        setQuestions(_.cloneDeep(questions));
        setAnswers(_.cloneDeep(answers));
        // trigger template update if snapshot changed
        // also cloneDeep in order to track changes above in isEqual
        if (_.isEqual(template, templateSnapshot.current) || _.isEmpty(templateSnapshot.current)) {
            templateSnapshot.current = _.cloneDeep(template);
            return;
        }
        templateSnapshot.current = _.cloneDeep(template);
        props.onTemplateChange(templateSnapshot.current);
    }, [conditions, template]);

    function onConditionDelete(id: string) {
        setConditions([...conditions.filter(condition => condition.id !== id)]);
    }

    function onConditionChange(id: string, nextCondition: Partial<ICondition>): void {
        const changedConditionIdx = conditions.findIndex(condition => condition.id === id);
        conditions[changedConditionIdx] = { ...conditions[changedConditionIdx], ...nextCondition };
        setConditions([...conditions]);
    }

    function onAddCondition(): void {
        if (
            questions.length === 0 ||
            (conditions.length !== 0 && !conditions.some(condition => !!condition.questionPuzzle))
        ) {
            return;
        }
        const conditionsHead = _.head(conditions) || { questionPuzzle: ETerminals.EMPTY };
        conditions.push({
            id: uuid(),
            order: conditions.length - 1,
            questionPuzzle: conditionsHead.questionPuzzle,
            answerPuzzle: ETerminals.EMPTY,
            value: ETerminals.EMPTY,
            actionType: EActionType.NONE,
            conditionType: EConditionType.OR,
        });
        setConditions([...conditions]);
    }

    return (
        <Grid container spacing={2} alignItems="flex-end">
            {conditions.map((condition, index) => {
                function onQuestionPuzzleChange(event: TChangeEvent): void {
                    // reset conditions length when question changed
                    conditions.length = 1;
                    // reset first condition fields when question changed
                    // and change questionPuzzle
                    onConditionChange(condition.id, {
                        answerPuzzle: ETerminals.EMPTY,
                        value: ETerminals.EMPTY,
                        actionType: EActionType.NONE,
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

                // const getConditionType = R.prop("conditionType");
                // const getActionType = R.prop("actionType");
                // const getAnswerPuzzleType = R.prop("puzzleType");
                const questionAnswers = answers.filter(answer => {
                    const question = questions.find(
                        question => question.id === condition.questionPuzzle
                    );
                    if (!question) {
                        return false;
                    }
                    return question.puzzles.some(puzzle => puzzle.id === answer.id);
                });
                const questionAnswersHead = _.head(questionAnswers) || {
                    puzzleType: (ETerminals.EMPTY as unknown) as EPuzzleType,
                };

                return (
                    <React.Fragment key={condition.id}>
                        <Grid xs={index === 0 ? 2 : 6} item>
                            {getConditionLiteral(index, condition.conditionType)}
                        </Grid>
                        {index === 0 && (
                            <Grid item xs={4}>
                                <FormControl fullWidth>
                                    <InputLabel htmlFor="question-puzzle">
                                        Выберите вопрос
                                    </InputLabel>
                                    <Select
                                        value={condition.questionPuzzle || ETerminals.EMPTY}
                                        input={<Input id="question-puzzle" />}
                                        onChange={onQuestionPuzzleChange}
                                    >
                                        {questions.length === 0 && (
                                            <MenuItem>Нет доступных вариантов</MenuItem>
                                        )}
                                        {questions.map(questionToChoseFrom => {
                                            return (
                                                <MenuItem
                                                    key={questionToChoseFrom.id}
                                                    value={questionToChoseFrom.id}
                                                >
                                                    {questionToChoseFrom.title}
                                                </MenuItem>
                                            );
                                        })}
                                    </Select>
                                </FormControl>
                            </Grid>
                        )}
                        {!!condition.questionPuzzle && (
                            <React.Fragment>
                                <Grid item xs={3}>
                                    <FormControl fullWidth>
                                        <InputLabel htmlFor="action-type">
                                            Выберите значение
                                        </InputLabel>
                                        <Select
                                            value={condition.actionType || ETerminals.EMPTY}
                                            input={<Input id="action-type" />}
                                            onChange={onActionTypeChange}
                                        >
                                            {getActionVariants(questionAnswersHead.puzzleType)}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={2}>
                                    {getAnswerPuzzle(condition, answers, questions)(
                                        condition.actionType === EActionType.CHOSEN_ANSWER
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
                    onClick={onAddCondition}
                >
                    + Добавить условие
                </Button>
            </Grid>
        </Grid>
    );
};

function getActionVariants(puzzleType: EPuzzleType): React.ReactNode {
    switch (puzzleType) {
        case EPuzzleType.TEXT_ANSWER:
        case EPuzzleType.NUMERIC_ANSWER:
        case EPuzzleType.DATE_ANSWER:
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
                <MenuItem key={EActionType.GIVEN_ANSWER} value={EActionType.GIVEN_ANSWER}>
                    {getActionLiteral(EActionType.GIVEN_ANSWER)}
                </MenuItem>,
            ];
        case EPuzzleType.DROPDOWN_ANSWER:
        case EPuzzleType.RADIO_ANSWER:
        case EPuzzleType.CHECKBOX_ANSWER:
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
                <MenuItem key={EActionType.GIVEN_ANSWER} value={EActionType.GIVEN_ANSWER}>
                    {getActionLiteral(EActionType.GIVEN_ANSWER)}
                </MenuItem>,
            ];
    }
}

function getAnswerPuzzle(
    condition: ICondition,
    answers: IPuzzle[],
    questions: IPuzzle[]
):
    | ((onValueChange: (event: TChangeEvent) => void) => React.ReactNode)
    | (() => React.ReactNode)
    | ((onAnswerPuzzleChange: (event: TChangeEvent) => void) => React.ReactNode) {
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
                            {answers.length === 0 && <MenuItem>Нет доступных вариантов</MenuItem>}
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

function getActionLiteral(actionType: EActionType): string {
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

function getConditionLiteral(index: number, conditionType: EConditionType): string {
    if (index === 0) {
        return "Если";
    }
    return {
        [EConditionType.AND]: "И",
        [EConditionType.OR]: "Или",
    }[conditionType];
}
