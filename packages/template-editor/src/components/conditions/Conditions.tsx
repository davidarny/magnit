/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import { Button, SelectField } from "@magnit/components";
import {
    EActionType,
    EConditionType,
    EPuzzleType,
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
import { useCondition, useConditions } from "hooks/condition";
import _ from "lodash";
import * as React from "react";
import { useCallback, useState } from "react";

interface IConditionsProps {
    initialState?: ICondition[];
    puzzleId: string;
    template: ITemplate;
    disabled?: boolean;
    focused?: boolean;

    onTemplateChange(template: ITemplate): void;
}

export const Conditions: React.FC<IConditionsProps> = props => {
    const {
        initialState,
        puzzleId,
        template,
        disabled = false,
        focused = true,
        onTemplateChange,
    } = props;

    const [
        conditions,
        questions,
        answers,
        onConditionDeleteCallback,
        onConditionChangeCallback,
        onAddConditionCallback,
    ] = useConditions(template, disabled, puzzleId, onTemplateChange, initialState);

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

Conditions.displayName = "Conditions";

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
    const [value, setValue] = useState<string>(condition.value || "");

    const onQuestionPuzzleChangeCallback = useCallback(
        (event: TSelectChangeEvent): void => {
            // reset conditions length when question changed
            conditions.length = 1;
            // reset first condition fields when question changed
            // and change questionPuzzle
            onConditionChange(condition.id, {
                answerPuzzle: "",
                value: "",
                actionType: "",
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
        puzzleType: ("" as unknown) as EPuzzleType,
    };

    const [getConditionLiteral, getActionVariants, getAnswerPuzzle] = useCondition(
        questionAnswersHead.puzzleType,
        condition,
        value,
        index,
        condition.conditionType,
    );

    const isFirstRow = index === 0;

    return (
        <React.Fragment key={condition.id}>
            {isFirstRow && (
                <Grid item>
                    <Typography css={theme => ({ color: theme.colors.secondary })}>
                        {getConditionLiteral()}
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
                        value={condition.questionPuzzle || ""}
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
                        value={condition.actionType || ""}
                        onChange={onActionTypeChangeCallback}
                        placeholder="Тип сравнения"
                    >
                        {getActionVariants()}
                    </SelectField>
                )}
            </Grid>
            <Grid item xs={4}>
                {!!condition.actionType &&
                    getAnswerPuzzle(answers, questions)
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

Condition.displayName = "Condition";
