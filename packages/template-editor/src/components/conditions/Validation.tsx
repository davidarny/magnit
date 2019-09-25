/** @jsx jsx */

import { jsx } from "@emotion/core";
import { SelectField } from "@magnit/components";
import {
    EConditionType,
    EOperatorType,
    EValidationType,
    IPuzzle,
    IValidation,
} from "@magnit/entities";
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
import { useValidation } from "hooks/condition";
import * as React from "react";
import { useCallback, useState } from "react";

interface IValidationProps {
    index: number;
    noDeleteButton: boolean;
    validation: IValidation;
    puzzle: IPuzzle;
    questions: IPuzzle[];

    onValidationChange(id: string, update: IValidation): void;

    onDeleteValidation(id: string): void;
}

type TSelectChangeEvent = React.ChangeEvent<{
    name?: string;
    value: unknown;
}>;

export const Validation: React.FC<IValidationProps> = props => {
    const {
        validation,
        index,
        questions,
        puzzle,
        noDeleteButton = false,
        onValidationChange,
        onDeleteValidation,
    } = props;

    const [value, setValue] = useState(validation.value || 0);

    const onOperatorTypeChangeCallback = useCallback(
        (event: TSelectChangeEvent): void => {
            onValidationChange(validation.id, {
                ...validation,
                operatorType: event.target.value as EOperatorType,
            });
        },
        [onValidationChange, validation],
    );

    const onRightHandPuzzleChange = useCallback(
        (event: TSelectChangeEvent): void => {
            onValidationChange(validation.id, {
                ...validation,
                rightHandPuzzle: event.target.value as string,
            });
        },
        [onValidationChange, validation],
    );

    function onValueChange(event: TSelectChangeEvent): void {
        setValue(event.target.value as number);
    }

    const onValueBlurCallback = useCallback(() => {
        onValidationChange(validation.id, { ...validation, value });
    }, [onValidationChange, validation, value]);

    const onValidationTypeChangeCallback = useCallback(
        (event: TSelectChangeEvent): void => {
            onValidationChange(validation.id, {
                ...validation,
                validationType: event.target.value as EValidationType,
            });
        },
        [onValidationChange, validation],
    );

    const onConditionTypeChangeCallback = useCallback(
        (event: unknown, value: unknown): void => {
            onValidationChange(validation.id, {
                ...validation,
                conditionType: value as EConditionType,
            });
        },
        [onValidationChange, validation],
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

    const currentQuestionId = puzzle ? puzzle.id : "";

    const currentQuestionTitle = puzzle
        ? puzzle.title
            ? puzzle.title
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

Validation.displayName = "Validation";
