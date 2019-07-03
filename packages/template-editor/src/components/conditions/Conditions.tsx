/* eslint-disable react-hooks/exhaustive-deps */
/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import {
    FormControlLabel,
    Grid,
    IconButton,
    MenuItem,
    Radio,
    RadioGroup,
    Typography,
} from "@material-ui/core";
import { Close as DeleteIcon } from "@material-ui/icons";
import { EActionType, EConditionType, ETerminals, ICondition, IPuzzle, ITemplate } from "entities";
import { traverse } from "services/json";
import { EPuzzleType } from "components/puzzle";
import _ from "lodash";
import uuid from "uuid/v4";
import { CustomButton, SelectField } from "@magnit/components";
import { AddIcon } from "@magnit/icons";
import { getConditionService } from "services/condition";

interface IConditionsProps {
    puzzleId: string;
    template: ITemplate;

    onTemplateChange(template: ITemplate): void;
}

type TChangeEvent = React.ChangeEvent<{ name?: string; value: unknown }>;

export const Conditions: React.FC<IConditionsProps> = props => {
    const { puzzleId, template } = props;
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
    const isParentPuzzleGroup = useRef(false);

    // check if parent of current puzzle is GROUP
    // if so we apply special rule when finding questions to reference
    useEffect(() => {
        traverse(template, (value: any, parent: any) => {
            if (typeof value !== "object" || !("puzzles" in value)) {
                return;
            }
            if (typeof parent !== "object" || !("puzzles" in parent)) {
                return;
            }
            const puzzle = value as IPuzzle;
            const parentPuzzle = parent as IPuzzle;
            const isGroupParent =
                "puzzleType" in parentPuzzle && parentPuzzle.puzzleType === EPuzzleType.GROUP;
            isParentPuzzleGroup.current = "id" in puzzle && puzzle.id === puzzleId && isGroupParent;
        });
    }, [template]);

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
                traverse(puzzle.puzzles[i], (value: any, parent: any) => {
                    if (typeof value !== "object" || !("puzzleType" in value)) {
                        return;
                    }
                    const puzzle = value as IPuzzle;
                    // check if parent of current item is GROUP puzzle
                    const isGroupParent =
                        parent &&
                        typeof parent === "object" &&
                        "puzzleType" in parent &&
                        parent.puzzleType === EPuzzleType.GROUP &&
                        !isParentPuzzleGroup.current;
                    // if puzzle is question and has non-empty title
                    // then it's allowed to be selected as a questionPuzzle
                    // disallow referencing to questions in GROUPS
                    if (
                        puzzle.puzzleType === EPuzzleType.QUESTION &&
                        puzzle.title.length > 0 &&
                        !isGroupParent
                    ) {
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
        // do not allow to delete if only one condition present
        if (conditions.length === 1) {
            return;
        }
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
        <Grid
            container
            spacing={2}
            css={css`
                margin-bottom: 0;
            `}
            alignItems="flex-end"
        >
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

                function onConditionTypeChange(event: unknown, value: unknown): void {
                    onConditionChange(condition.id, {
                        conditionType: value as EConditionType,
                    });
                }

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

                const conditionService = getConditionService({
                    index,
                    condition,
                    puzzleType: questionAnswersHead.puzzleType,
                });

                const isFirstRow = index === 0;
                return (
                    <React.Fragment key={condition.id}>
                        {isFirstRow && (
                            <Grid item>
                                <Typography>{conditionService.getConditionLiteral()}</Typography>
                            </Grid>
                        )}
                        <Grid
                            xs={isFirstRow ? "auto" : 4}
                            item
                            style={{
                                marginLeft: isFirstRow ? 0 : 70,
                            }}
                        >
                            {!isFirstRow && (
                                <React.Fragment>
                                    <RadioGroup
                                        value={condition.conditionType}
                                        onChange={onConditionTypeChange}
                                        row
                                    >
                                        <FormControlLabel
                                            value={EConditionType.AND}
                                            control={
                                                <Radio
                                                    css={theme => ({
                                                        color: `${theme.colors.blue} !important`,
                                                        ":hover": {
                                                            backgroundColor: "#2f97ff14 !important",
                                                        },
                                                    })}
                                                />
                                            }
                                            label="И"
                                            labelPlacement="end"
                                        />
                                        <FormControlLabel
                                            value={EConditionType.OR}
                                            control={
                                                <Radio
                                                    css={theme => ({
                                                        color: `${theme.colors.blue} !important`,
                                                        ":hover": {
                                                            backgroundColor: "#2f97ff14 !important",
                                                        },
                                                    })}
                                                />
                                            }
                                            label="Или"
                                            labelPlacement="end"
                                        />
                                    </RadioGroup>
                                </React.Fragment>
                            )}
                        </Grid>
                        {isFirstRow && (
                            <Grid item xs={4}>
                                <SelectField
                                    id={"question-puzzle"}
                                    fullWidth={true}
                                    value={condition.questionPuzzle || ETerminals.EMPTY}
                                    onChange={onQuestionPuzzleChange}
                                    placeholder={"Выберите вопрос"}
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
                                </SelectField>
                            </Grid>
                        )}

                        <React.Fragment>
                            <Grid item xs={3}>
                                {!!condition.questionPuzzle && (
                                    <SelectField
                                        id={"action-type"}
                                        fullWidth={true}
                                        value={condition.actionType || ETerminals.EMPTY}
                                        onChange={onActionTypeChange}
                                        placeholder={"Выберите значение"}
                                    >
                                        {conditionService.getActionVariants()}
                                    </SelectField>
                                )}
                            </Grid>
                            <Grid item xs={2}>
                                {!!condition.questionPuzzle &&
                                    conditionService.getAnswerPuzzle(answers, questions)(
                                        condition.actionType === EActionType.CHOSEN_ANSWER
                                            ? onAnswerPuzzleChange
                                            : onValueChange
                                    )}
                            </Grid>
                        </React.Fragment>
                        <Grid item xs={2}>
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
            <Grid container style={{ marginTop: 10 }}>
                <Grid css={theme => ({ marginLeft: theme.spacing(9) })}>
                    <CustomButton
                        variant="outlined"
                        color="primary"
                        onClick={onAddCondition}
                        title={"Добавить внутреннее условие"}
                        icon={<AddIcon isActive={true} />}
                        scheme={"blueOutline"}
                        css={theme => ({
                            width: 290,
                            marginLeft: theme.spacing(0.5),
                        })}
                    />
                </Grid>
            </Grid>
        </Grid>
    );
};
