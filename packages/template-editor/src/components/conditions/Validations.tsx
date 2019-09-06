/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import { Button, InputField, SelectField } from "@magnit/components";
import {
    EConditionType,
    EOperatorType,
    EPuzzleType,
    ETerminals,
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
import _ from "lodash";
import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { getValidationService } from "services/condition";
import { traverse } from "services/json";
import uuid from "uuid/v4";

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
    const { puzzleId, template, disabled = false, focused = true, onTemplateChange } = props;
    const initialState = props.initialState && props.initialState.length && props.initialState;
    const defaultState = {
        id: uuid(),
        order: 0,
        leftHandPuzzle: ETerminals.EMPTY,
        errorMessage: ETerminals.EMPTY,
        operatorType: EOperatorType.NONE,
        validationType: EValidationType.NONE,
        conditionType: EConditionType.OR,
    };
    const [validations, setValidations] = useState<IValidation[]>(initialState || [defaultState]);
    const [errorMessage, setErrorMessage] = useState<string>(
        _.get(_.first(validations), "errorMessage", ETerminals.EMPTY),
    );
    const [questions, setQuestions] = useState<IPuzzle[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState<IPuzzle | null>(null);

    const templateSnapshot = useRef<ITemplate>({} as ITemplate);
    const isParentPuzzleGroup = useRef(false);

    // check if parent of current puzzle is GROUP
    // if so we apply special rule when finding questions to reference
    useEffect(() => {
        if (disabled) {
            return;
        }
        traverse(template, (value: any, parent: any) => {
            if (!_.has(value, "puzzles") || !_.has(parent, "puzzles")) {
                return;
            }
            const puzzle = value as IPuzzle;
            const parentPuzzle = parent as IPuzzle;
            const isGroupParent = parentPuzzle.puzzleType === EPuzzleType.GROUP;
            isParentPuzzleGroup.current = puzzle.id === puzzleId && isGroupParent;
        });
    }, [template, disabled, puzzleId]);

    // get current question
    const prevValidations = useRef(_.cloneDeep(validations));
    useEffect(() => {
        if (disabled) {
            return;
        }
        traverse(template, (value: any) => {
            if (!_.has(value, "puzzles")) {
                return;
            }
            const puzzle = value as IPuzzle;
            if (!_.has(puzzle, "id") || puzzle.id !== puzzleId) {
                return;
            }
            setCurrentQuestion(puzzle);
            const nextValidations = validations.map(validation => ({
                ...validation,
                leftHandPuzzle: puzzle.id,
            }));
            if (!_.isEqual(prevValidations.current, nextValidations)) {
                prevValidations.current = _.cloneDeep(nextValidations);
                setValidations([...nextValidations]);
            }
        });
    }, [template, disabled, puzzleId, validations]);

    const prevQuestions = useRef(_.cloneDeep(questions));
    useEffect(() => {
        if (disabled) {
            return;
        }
        // track if template is changed
        // outside of this component
        if (!_.isEqual(template, templateSnapshot.current)) {
            validations.forEach((validation, index, array) => {
                let hasDependentQuestionChanged = false;
                const dependentQuestion = questions.find(
                    question => question.id === validation.rightHandPuzzle,
                );
                if (dependentQuestion) {
                    traverse(template, (value: any) => {
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
                            _.omit(dependentQuestion, "validations"),
                            _.omit(puzzle, "validations"),
                        );
                    });
                    if (hasDependentQuestionChanged) {
                        validation.rightHandPuzzle = undefined;
                        validation.value = undefined;
                        validation.operatorType = EOperatorType.NONE;
                        validation.validationType = EValidationType.NONE;
                        array[index] = { ...validation };
                    }
                }
            });
        }
        // fill questions and answers initially
        // by traversing whole template tree
        questions.length = 0;
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
                    if (!_.has(value, "puzzles")) {
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
                        // check if all children of questions are numeric
                        (puzzle.puzzles || []).every(
                            child => child.puzzleType === EPuzzleType.NUMERIC_ANSWER,
                        ) &&
                        puzzle.title.length > 0 &&
                        !isGroupParent
                    ) {
                        questions.push(puzzle);
                    }
                });
            });
            // set validations of current puzzle
            puzzle.puzzles[index].validations = [...validations].filter(
                validation =>
                    !!(
                        validation.validationType &&
                        validation.conditionType &&
                        validation.operatorType &&
                        validation.errorMessage &&
                        (validation.rightHandPuzzle || validation.value)
                    ),
            );
        });
        if (!_.isEqual(prevQuestions.current, questions)) {
            const clonedQuestions = _.cloneDeep(questions);
            prevQuestions.current = clonedQuestions;
            setQuestions(clonedQuestions);
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
    }, [validations, template, disabled, questions, puzzleId, onTemplateChange]);

    const onDeleteValidationCallback = useCallback(
        (id: string) => {
            // do not allow to delete if only one validation present
            if (validations.length === 1) {
                setValidations([defaultState]);
                return;
            }
            setValidations([...validations.filter(validation => validation.id !== id)]);
        },
        [defaultState, validations],
    );

    const onValidationChangeCallback = useCallback(
        (id: string, nextValidation: Partial<IValidation>): void => {
            const changedValidationIdx = validations.findIndex(validation => validation.id === id);
            validations[changedValidationIdx] = {
                ...validations[changedValidationIdx],
                ...nextValidation,
            };
            setValidations([...validations]);
        },
        [validations],
    );

    const onAddValidationCallback = useCallback((): void => {
        if (
            questions.length === 0 ||
            (validations.length !== 0 &&
                !validations.some(validation => !!validation.leftHandPuzzle))
        ) {
            return;
        }
        validations.push({
            id: uuid(),
            order: validations.length - 1,
            leftHandPuzzle: (currentQuestion && currentQuestion.id) || ETerminals.EMPTY,
            validationType: EValidationType.NONE,
            operatorType: EOperatorType.NONE,
            errorMessage: ETerminals.EMPTY,
            conditionType: EConditionType.OR,
        });
        setValidations([...validations]);
    }, [currentQuestion, questions.length, validations]);

    function onErrorMessageChange(event: TSelectChangeEvent) {
        setErrorMessage(event.target.value as string);
    }

    const onErrorMessageBlurCallback = useCallback(() => {
        const firstValidation = _.first(validations);
        if (firstValidation) {
            firstValidation.errorMessage = errorMessage;
        }
        setValidations([...validations.map(validation => ({ ...validation, errorMessage }))]);
    }, [errorMessage, validations]);

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

    const validationService = getValidationService({
        ...validation,
        index,
        validation,
        value,
    });

    const isFirstRow = index === 0;

    const currentQuestionId = currentQuestion ? currentQuestion.id : ETerminals.EMPTY;

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
                        {validationService.getConditionLiteral()}
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
                        value={validation.operatorType || ETerminals.EMPTY}
                        onChange={onOperatorTypeChangeCallback}
                        placeholder="Выберите значение"
                    >
                        {validationService.getOperatorVariants()}
                    </SelectField>
                )}
            </Grid>
            <Grid item xs={2}>
                {!!validation.operatorType && (
                    <SelectField
                        id="validation-type"
                        fullWidth
                        value={validation.validationType || ETerminals.EMPTY}
                        onChange={onValidationTypeChangeCallback}
                        placeholder="Тип сравнения"
                    >
                        {validationService.getValidationVariants()}
                    </SelectField>
                )}
            </Grid>
            <Grid item xs={3}>
                {!!validation.validationType &&
                    validationService
                        .getRightHandPuzzle(questions)
                        .setRightHandPuzzleChangeHandler(onRightHandPuzzleChange)
                        .setValueChangeHandler(onValueChange)
                        .setValueBlurHandler(onValueBlurCallback)
                        .build()}
            </Grid>
            {!noDeleteButton && validation.operatorType && (
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
