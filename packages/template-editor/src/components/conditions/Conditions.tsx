/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import { Button, SelectField } from "@magnit/components";
import {
    EActionType,
    EConditionType,
    EPuzzleType,
    ETerminals,
    ICondition,
    IPuzzle,
    ITemplate,
} from "@magnit/entities";
import { AddIcon } from "@magnit/icons";
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
import _ from "lodash";
import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { getConditionService } from "services/condition";
import { traverse } from "services/json";
import uuid from "uuid/v4";

interface IConditionsProps {
    initialState?: ICondition[];
    puzzleId: string;
    template: ITemplate;
    disabled?: boolean;
    focused?: boolean;

    onTemplateChange(template: ITemplate): void;
}

export const Conditions: React.FC<IConditionsProps> = props => {
    const { puzzleId, template, disabled = false, focused = true, onTemplateChange } = props;
    const defaultState = {
        id: uuid(),
        order: 0,
        questionPuzzle: ETerminals.EMPTY,
        answerPuzzle: ETerminals.EMPTY,
        value: ETerminals.EMPTY,
        actionType: EActionType.NONE,
        conditionType: EConditionType.OR,
    };
    const initialState = props.initialState && props.initialState.length && props.initialState;
    const [conditions, setConditions] = useState<ICondition[]>(initialState || [defaultState]);
    const [questions, setQuestions] = useState<IPuzzle[]>([]);
    const [answers, setAnswers] = useState<IPuzzle[]>([]);

    const templateSnapshot = useRef<ITemplate>({} as ITemplate);
    const isParentPuzzleGroup = useRef(false);

    // check if parent of current puzzle is GROUP
    // if so we apply special rule when finding questions to reference
    useEffect(() => {
        if (disabled) {
            return;
        }
        traverse(template, (value: unknown, parent: unknown) => {
            if (!_.has(value, "puzzles") || !_.has(parent, "puzzles")) {
                return;
            }
            const puzzle = value as IPuzzle;
            const parentPuzzle = parent as IPuzzle;
            const isGroupParent = parentPuzzle.puzzleType === EPuzzleType.GROUP;
            isParentPuzzleGroup.current = puzzle.id === puzzleId && isGroupParent;
        });
    }, [template, disabled, puzzleId]);

    const prevQuestions = useRef(_.cloneDeep(questions));
    const prevAnswers = useRef(_.cloneDeep(answers));
    useEffect(() => {
        if (disabled) {
            return;
        }
        // track if template is changed
        // outside of this component
        if (!_.isEqual(template, templateSnapshot.current)) {
            conditions.forEach((condition, index, array) => {
                let hasDependentQuestionChanged = false;
                const dependentQuestion = questions.find(
                    question => question.id === condition.questionPuzzle,
                );
                if (dependentQuestion) {
                    traverse(template, (value: unknown) => {
                        if (!_.has(value, "puzzles")) {
                            return;
                        }
                        const puzzle = value as IPuzzle;
                        // find dependent question in template
                        if (
                            puzzle.puzzleType !== EPuzzleType.QUESTION ||
                            puzzle.id !== dependentQuestion.id
                        ) {
                            return;
                        }
                        // check if dependent question has changed
                        hasDependentQuestionChanged = !_.isEqual(
                            _.omit(dependentQuestion, "conditions"),
                            _.omit(puzzle, "conditions"),
                        );
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
            if (!_.has(value, "puzzles")) {
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
                    if (!_.has(value, "puzzleType")) {
                        return;
                    }
                    const puzzle = value as IPuzzle;
                    // check if parent of current item is GROUP puzzle
                    const isGroupParent =
                        parent &&
                        parent.puzzleType === EPuzzleType.GROUP &&
                        !isParentPuzzleGroup.current;
                    // if puzzle is question and has non-empty title
                    // then it's allowed to be selected as a questionPuzzle
                    // disallow referencing to questions in GROUPS
                    if (
                        puzzle.puzzleType === EPuzzleType.QUESTION &&
                        puzzle.title.toString().length > 0 &&
                        !isGroupParent
                    ) {
                        questions.push(puzzle);
                        return;
                    }
                    // if puzzle is one of answers types
                    // then it's allowed to be selected as an answerPuzzle
                    const excludedPuzzleTypes = [EPuzzleType.GROUP, EPuzzleType.QUESTION];
                    if (!excludedPuzzleTypes.includes(puzzle.puzzleType)) {
                        answers.push(puzzle);
                        return;
                    }
                });
            });
            // set conditions of current puzzle
            puzzle.puzzles[index].conditions = [...conditions].filter(
                condition =>
                    !!(
                        condition.actionType &&
                        condition.conditionType &&
                        condition.questionPuzzle &&
                        (condition.value || condition.answerPuzzle)
                    ),
            );
        });
        if (!_.isEqual(prevQuestions.current, questions)) {
            const clonedQuestions = _.cloneDeep(questions);
            prevQuestions.current = clonedQuestions;
            setQuestions(clonedQuestions);
        }
        if (!_.isEqual(prevAnswers.current, answers)) {
            const clonedAnswers = _.cloneDeep(answers);
            prevAnswers.current = clonedAnswers;
            setAnswers(clonedAnswers);
        }
        // trigger template update if snapshot changed
        // also cloneDeep in order to track changes above in isEqual
        const clonedTemplate = _.cloneDeep(template);
        if (_.isEqual(template, templateSnapshot.current) || _.isEmpty(templateSnapshot.current)) {
            templateSnapshot.current = clonedTemplate;
            return;
        }
        templateSnapshot.current = clonedTemplate;
        onTemplateChange(templateSnapshot.current);
    }, [conditions, template, disabled, questions, answers, onTemplateChange, puzzleId]);

    const onConditionDeleteCallback = useCallback(
        (id: string) => {
            // do not allow to delete if only one condition present
            if (conditions.length === 1) {
                setConditions([defaultState]);
                return;
            }
            setConditions([...conditions.filter(condition => condition.id !== id)]);
        },
        [conditions, defaultState],
    );

    const onConditionChangeCallback = useCallback(
        (id: string, nextCondition: Partial<ICondition>): void => {
            const changedConditionIdx = conditions.findIndex(condition => condition.id === id);
            conditions[changedConditionIdx] = {
                ...conditions[changedConditionIdx],
                ...nextCondition,
            };
            setConditions([...conditions]);
        },
        [conditions],
    );

    const onAddConditionCallback = useCallback((): void => {
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
    }, [conditions, questions.length]);

    return (
        <Grid
            container
            spacing={2}
            css={css`
                margin-bottom: 0;
            `}
            alignItems="center"
        >
            {conditions.map((condition, index) => (
                <Condition
                    key={condition.id}
                    answers={answers}
                    condition={condition}
                    conditions={conditions}
                    index={index}
                    onConditionChange={onConditionChangeCallback}
                    onConditionDelete={onConditionDeleteCallback}
                    questions={questions}
                    noDeleteButton={!focused}
                />
            ))}
            {focused && (
                <Grid item xs={4} css={theme => ({ marginLeft: theme.spacing(9) })}>
                    <Button
                        fullWidth
                        variant="outlined"
                        color="primary"
                        onClick={onAddConditionCallback}
                        scheme="outline"
                    >
                        <AddIcon css={theme => ({ color: theme.colors.primary })} />
                        <Typography css={theme => ({ fontSize: theme.fontSize.normal })}>
                            Добавить внутреннее условие
                        </Typography>
                    </Button>
                </Grid>
            )}
        </Grid>
    );
};

interface IConditionProps {
    index: number;
    noDeleteButton: boolean;
    condition: ICondition;
    conditions: ICondition[];
    questions: IPuzzle[];
    answers: IPuzzle[];

    onConditionChange(id: string, update: Partial<ICondition>): void;

    onConditionDelete(id: string): void;
}

type TSelectChangeEvent = React.ChangeEvent<{
    name?: string;
    value: unknown;
}>;

const Condition: React.FC<IConditionProps> = props => {
    const { condition, conditions, answers, questions, index, noDeleteButton = false } = props;
    const { onConditionChange, onConditionDelete } = props;
    const [value, setValue] = useState<string>(condition.value || ETerminals.EMPTY);

    const onQuestionPuzzleChangeCallback = useCallback(
        (event: TSelectChangeEvent): void => {
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
        },
        [condition.id, conditions.length, onConditionChange],
    );

    const onActionTypeChangeCallback = useCallback(
        (event: TSelectChangeEvent): void => {
            onConditionChange(condition.id, {
                actionType: event.target.value as EActionType,
            });
        },
        [condition.id, onConditionChange],
    );

    const onAnswerPuzzleChangeCallback = useCallback(
        (event: TSelectChangeEvent): void => {
            onConditionChange(condition.id, {
                answerPuzzle: event.target.value as string,
            });
        },
        [condition.id, onConditionChange],
    );

    function onValueChange(event: TSelectChangeEvent): void {
        setValue(event.target.value as string);
    }

    const onValueBlurCallback = useCallback(() => {
        onConditionChange(condition.id, { value });
    }, [condition.id, onConditionChange, value]);

    const onConditionTypeChangeCallback = useCallback(
        (event: unknown, value: unknown): void => {
            onConditionChange(condition.id, {
                conditionType: value as EConditionType,
            });
        },
        [condition.id, onConditionChange],
    );

    const onConditionDeleteCallback = useCallback(() => {
        onConditionDelete(condition.id);
    }, [condition.id, onConditionDelete]);

    const questionAnswers = answers.filter(answer => {
        const question = questions.find(question => question.id === condition.questionPuzzle);
        if (!question) {
            return false;
        }
        return question.puzzles.some(puzzle => puzzle.id === answer.id);
    });
    const questionAnswersHead = _.head(questionAnswers) || {
        puzzleType: (ETerminals.EMPTY as unknown) as EPuzzleType,
    };

    const conditionService = getConditionService({
        ...questionAnswersHead,
        ...condition,
        index,
        condition,
        value,
    });

    const isFirstRow = index === 0;

    return (
        <React.Fragment key={condition.id}>
            {isFirstRow && (
                <Grid item>
                    <Typography css={theme => ({ color: theme.colors.secondary })}>
                        {conditionService.getConditionLiteral()}
                    </Typography>
                </Grid>
            )}
            {!isFirstRow && (
                <Grid xs={4} item css={theme => ({ marginLeft: theme.spacing(9) })}>
                    <RadioGroup
                        value={condition.conditionType}
                        onChange={onConditionTypeChangeCallback}
                        row
                    >
                        <FormControlLabel
                            value={EConditionType.AND}
                            control={
                                <Radio
                                    css={theme => ({
                                        color: `${theme.colors.primary} !important`,
                                        ":hover": {
                                            background: `${theme.colors.primary}14 !important`,
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
                                        color: `${theme.colors.primary} !important`,
                                        ":hover": {
                                            background: `${theme.colors.primary}14 !important`,
                                        },
                                    })}
                                />
                            }
                            label="Или"
                            labelPlacement="end"
                        />
                    </RadioGroup>
                </Grid>
            )}
            {isFirstRow && (
                <Grid item xs={4} css={theme => ({ marginLeft: theme.spacing(2) })}>
                    <SelectField
                        id="question-puzzle"
                        fullWidth={true}
                        value={condition.questionPuzzle || ETerminals.EMPTY}
                        onChange={onQuestionPuzzleChangeCallback}
                        placeholder="Выберите вопрос"
                    >
                        {questions.map(questionToChoseFrom => (
                            <MenuItem key={questionToChoseFrom.id} value={questionToChoseFrom.id}>
                                {questionToChoseFrom.title}
                            </MenuItem>
                        ))}
                    </SelectField>
                </Grid>
            )}
            <Grid item xs={2}>
                {!!condition.questionPuzzle && (
                    <SelectField
                        id="action-type"
                        fullWidth={true}
                        value={condition.actionType || ETerminals.EMPTY}
                        onChange={onActionTypeChangeCallback}
                        placeholder="Тип сравнения"
                    >
                        {conditionService.getActionVariants()}
                    </SelectField>
                )}
            </Grid>
            <Grid item xs={4}>
                {!!condition.actionType &&
                    conditionService
                        .getAnswerPuzzle(answers, questions)
                        .setAnswerPuzzleChangeHandler(onAnswerPuzzleChangeCallback)
                        .setValueChangeHandler(onValueChange)
                        .setValueBlurHandler(onValueBlurCallback)
                        .build()}
            </Grid>
            {!noDeleteButton && condition.questionPuzzle && (
                <Grid item xs>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <IconButton onClick={onConditionDeleteCallback}>
                                <DeleteIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Grid>
            )}
        </React.Fragment>
    );
};
