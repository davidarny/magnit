/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import { Button, InputField, SelectField } from "@magnit/components";
import {
    EConditionType,
    EOperatorType,
    EValidationType,
    IPuzzle,
    ITemplate,
    IValidation,
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
import { useValidation, useValidations } from "hooks/condition";
import * as React from "react";
import { useCallback, useState } from "react";

interface IValidationsProps {
    initialState?: IValidation[];
    puzzleId: string;
    template: ITemplate;
    disabled?: boolean;
    focused?: boolean;

    onTemplateChange(template: ITemplate): void;
}

type TSelectChangeEvent = React.ChangeEvent<{
    name?: string;
    value: unknown;
}>;

export const Validations: React.FC<IValidationsProps> = props => {
    const {
        initialState,
        puzzleId,
        template,
        disabled = false,
        focused = true,
        onTemplateChange,
    } = props;

    const [
        validations,
        questions,
        currentQuestion,
        errorMessage,
        onDeleteValidationCallback,
        onValidationChangeCallback,
        onAddValidationCallback,
        onErrorMessageChange,
        onErrorMessageBlurCallback,
    ] = useValidations(template, disabled, puzzleId, onTemplateChange, initialState);

    return (
        <Grid
            container
            spacing={2}
            css={css`
                margin-bottom: 0;
            `}
            alignItems="center"
        >
            {validations.map((validation, index) => (
                <Validation
                    key={validation.id}
                    validation={validation}
                    index={index}
                    currentQuestion={currentQuestion}
                    onDeleteValidation={onDeleteValidationCallback}
                    onValidationChange={onValidationChangeCallback}
                    questions={questions}
                    noDeleteButton={!focused}
                />
            ))}
            {focused && (
                <Grid item xs={3} css={theme => ({ marginLeft: theme.spacing(9) })}>
                    <Button
                        fullWidth
                        variant="outlined"
                        color="primary"
                        onClick={onAddValidationCallback}
                        scheme="outline"
                    >
                        <AddIcon css={theme => ({ color: theme.colors.primary })} />
                        <Typography css={theme => ({ fontSize: theme.fontSize.normal })}>
                            Добавить внутреннее условие
                        </Typography>
                    </Button>
                </Grid>
            )}
            <Grid item xs={12}>
                <Grid container>
                    <Grid
                        item
                        xs
                        css={css`
                            display: flex;
                            align-items: center;
                        `}
                    >
                        <Typography
                            css={theme => ({ color: theme.colors.secondary })}
                            variant="subtitle1"
                        >
                            То
                        </Typography>
                    </Grid>
                    <Grid item xs={11} css={theme => ({ marginRight: theme.spacing(2) })}>
                        <InputField
                            value={errorMessage}
                            onChange={onErrorMessageChange}
                            onBlur={onErrorMessageBlurCallback}
                            fullWidth
                        />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};

interface IValidationProps {
    index: number;
    noDeleteButton: boolean;
    validation: IValidation;
    currentQuestion: IPuzzle | null;
    questions: IPuzzle[];

    onValidationChange(id: string, update: Partial<IValidation>): void;

    onDeleteValidation(id: string): void;
}

const Validation: React.FC<IValidationProps> = props => {
    const { validation, index, questions, currentQuestion, noDeleteButton = false } = props;
    const { onValidationChange, onDeleteValidation } = props;
    const [value, setValue] = useState(validation.value || 0);

    const onOperatorTypeChangeCallback = useCallback(
        (event: TSelectChangeEvent): void => {
            onValidationChange(validation.id, {
                operatorType: event.target.value as EOperatorType,
            });
        },
        [onValidationChange, validation.id],
    );

    const onRightHandPuzzleChange = useCallback(
        (event: TSelectChangeEvent): void => {
            onValidationChange(validation.id, {
                rightHandPuzzle: event.target.value as string,
            });
        },
        [onValidationChange, validation.id],
    );

    function onValueChange(event: TSelectChangeEvent): void {
        setValue(event.target.value as number);
    }

    const onValueBlurCallback = useCallback(() => {
        onValidationChange(validation.id, { value });
    }, [onValidationChange, validation.id, value]);

    const onValidationTypeChangeCallback = useCallback(
        (event: TSelectChangeEvent): void => {
            onValidationChange(validation.id, {
                validationType: event.target.value as EValidationType,
            });
        },
        [onValidationChange, validation.id],
    );

    const onConditionTypeChangeCallback = useCallback(
        (event: unknown, value: unknown): void => {
            onValidationChange(validation.id, {
                conditionType: value as EConditionType,
            });
        },
        [onValidationChange, validation.id],
    );

    const onDeleteValidationHandlerCallback = useCallback(() => {
        onDeleteValidation(validation.id);
    }, [onDeleteValidation, validation.id]);

    const [
        getConditionLiteral,
        getOperatorVariants,
        getRightHandPuzzle,
        getValidationVariants,
    ] = useValidation(validation, value, index, validation.conditionType);

    const isFirstRow = index === 0;

    const currentQuestionId = currentQuestion ? currentQuestion.id : "";

    const currentQuestionTitle = currentQuestion
        ? currentQuestion.title
            ? currentQuestion.title
            : "(текущий вопрос)"
        : "(текущий вопрос)";

    return (
        <React.Fragment key={validation.id}>
            {isFirstRow && (
                <Grid item>
                    <Typography css={theme => ({ color: theme.colors.secondary })}>
                        {getConditionLiteral()}
                    </Typography>
                </Grid>
            )}
            {!isFirstRow && (
                <Grid xs={3} item css={theme => ({ marginLeft: theme.spacing(9) })}>
                    <RadioGroup
                        value={validation.conditionType}
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
                <Grid item xs={3} css={theme => ({ marginLeft: theme.spacing(2) })}>
                    <SelectField
                        id="left-hand-puzzle"
                        fullWidth
                        value={currentQuestionId}
                        placeholder="Выберите вопрос"
                        disabled
                        displayEmpty={false}
                    >
                        <MenuItem key={currentQuestionId} value={currentQuestionId}>
                            {currentQuestionTitle}
                        </MenuItem>
                    </SelectField>
                </Grid>
            )}
            <Grid item xs={2}>
                {!!validation.leftHandPuzzle && (
                    <SelectField
                        id="operator-type"
                        fullWidth
                        value={validation.operatorType || ""}
                        onChange={onOperatorTypeChangeCallback}
                        placeholder="Выберите значение"
                    >
                        {getOperatorVariants()}
                    </SelectField>
                )}
            </Grid>
            <Grid item xs={2}>
                {!!validation.operatorType && (
                    <SelectField
                        id="validation-type"
                        fullWidth
                        value={validation.validationType || ""}
                        onChange={onValidationTypeChangeCallback}
                        placeholder="Тип сравнения"
                    >
                        {getValidationVariants()}
                    </SelectField>
                )}
            </Grid>
            <Grid item xs={3}>
                {!!validation.validationType &&
                    getRightHandPuzzle(questions)
                        .setRightHandPuzzleChangeHandler(onRightHandPuzzleChange)
                        .setValueChangeHandler(onValueChange)
                        .setValueBlurHandler(onValueBlurCallback)
                        .build()}
            </Grid>
            {!noDeleteButton && (validation.operatorType || index !== 0) && (
                <Grid item xs>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <IconButton onClick={onDeleteValidationHandlerCallback}>
                                <DeleteIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                </Grid>
            )}
        </React.Fragment>
    );
};
