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
import {
    EConditionType,
    EOperatorType,
    ETerminals,
    EValidationType,
    IPuzzle,
    ITemplate,
    IValidation,
} from "entities";
import { traverse } from "services/json";
import { EPuzzleType } from "components/puzzle";
import _ from "lodash";
import uuid from "uuid/v4";
import { CustomButton, InputField, SelectField } from "@magnit/components";
import { AddIcon } from "@magnit/icons";
import { getValidationService } from "services/condition";

interface IValidationsProps {
    puzzleId: string;
    template: ITemplate;

    onTemplateChange(template: ITemplate): void;
}

type TChangeEvent = React.ChangeEvent<{ name?: string; value: unknown }>;

export const Validations: React.FC<IValidationsProps> = props => {
    const { puzzleId, template } = props;
    const [validations, setValidations] = useState<IValidation[]>([
        {
            id: uuid(),
            order: 0,
            leftHandPuzzle: ETerminals.EMPTY,
            errorMessage: ETerminals.EMPTY,
            operatorType: EOperatorType.NONE,
            validationType: EValidationType.NONE,
            conditionType: EConditionType.OR,
        },
    ]);
    const [questions, setQuestions] = useState<IPuzzle[]>([]);
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
            validations.forEach((validation, index, array) => {
                let hasDependentQuestionChanged = false;
                const dependentQuestion = questions.find(
                    question => question.id === validation.rightHandPuzzle
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
        traverse(template, (value: any, parent: any) => {
            if (value === null) {
                console.log("%c%s", "color:" + "#006DFF", "", value, parent);
            }
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
                    }
                });
            });
            // set validations of current puzzle
            puzzle.puzzles[index].validations = [...validations];
        });
        setQuestions(_.cloneDeep(questions));
        // trigger template update if snapshot changed
        // also cloneDeep in order to track changes above in isEqual
        if (_.isEqual(template, templateSnapshot.current) || _.isEmpty(templateSnapshot.current)) {
            templateSnapshot.current = _.cloneDeep(template);
            return;
        }
        templateSnapshot.current = _.cloneDeep(template);
        props.onTemplateChange(templateSnapshot.current);
    }, [validations, template]);

    function onDeleteValidation(id: string) {
        // do not allow to delete if only one validation present
        if (validations.length === 1) {
            return;
        }
        setValidations([...validations.filter(validation => validation.id !== id)]);
    }

    function onValidationChange(id: string, nextValidation: Partial<IValidation>): void {
        const changedValidationIdx = validations.findIndex(validation => validation.id === id);
        validations[changedValidationIdx] = {
            ...validations[changedValidationIdx],
            ...nextValidation,
        };
        setValidations([...validations]);
    }

    function onAddValidation(): void {
        if (
            questions.length === 0 ||
            (validations.length !== 0 &&
                !validations.some(validation => !!validation.leftHandPuzzle))
        ) {
            return;
        }
        const validationsHead = _.head(validations) || { leftHandPuzzle: ETerminals.EMPTY };
        validations.push({
            id: uuid(),
            order: validations.length - 1,
            leftHandPuzzle: validationsHead.leftHandPuzzle,
            validationType: EValidationType.NONE,
            operatorType: EOperatorType.NONE,
            errorMessage: ETerminals.EMPTY,
            conditionType: EConditionType.OR,
        });
        setValidations([...validations]);
    }

    return (
        <Grid
            container
            spacing={2}
            css={css`
                margin-bottom: 0;
            `}
            alignItems="center"
        >
            {validations.map((validation, index) => {
                function onLeftHandPuzzleChange(event: TChangeEvent): void {
                    // reset validations length when question changed
                    validations.length = 1;
                    // reset first validation fields when question changed
                    // and change questionPuzzle
                    onValidationChange(validation.id, {
                        leftHandPuzzle: event.target.value as string,
                        validationType: EValidationType.NONE,
                        operatorType: EOperatorType.NONE,
                        conditionType: EConditionType.OR,
                        errorMessage: ETerminals.EMPTY,
                    });
                }

                function onOperatorTypeChange(event: TChangeEvent): void {
                    onValidationChange(validation.id, {
                        operatorType: event.target.value as EOperatorType,
                    });
                }

                function onRightHandPuzzleChange(event: TChangeEvent): void {
                    onValidationChange(validation.id, {
                        rightHandPuzzle: event.target.value as string,
                    });
                }

                function onValueChange(event: TChangeEvent): void {
                    onValidationChange(validation.id, {
                        value: event.target.value as number,
                    });
                }

                function onValidationTypeChange(event: TChangeEvent): void {
                    onValidationChange(validation.id, {
                        validationType: event.target.value as EValidationType,
                    });
                }

                function onConditionTypeChange(event: unknown, value: unknown): void {
                    onValidationChange(validation.id, {
                        conditionType: value as EConditionType,
                    });
                }

                const validationService = getValidationService({
                    index,
                    validation,
                    conditionType: validation.conditionType,
                });

                const isFirstRow = index === 0;

                return (
                    <React.Fragment key={validation.id}>
                        {isFirstRow && (
                            <Grid item>
                                <Typography>{validationService.getConditionLiteral()}</Typography>
                            </Grid>
                        )}
                        <Grid
                            xs={isFirstRow ? "auto" : 3}
                            item
                            css={theme => ({ marginLeft: isFirstRow ? 0 : theme.spacing(9) })}
                        >
                            {!isFirstRow && (
                                <React.Fragment>
                                    <RadioGroup
                                        value={validation.conditionType}
                                        onChange={onConditionTypeChange}
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
                                </React.Fragment>
                            )}
                        </Grid>
                        {isFirstRow && (
                            <Grid item xs={3}>
                                <SelectField
                                    id={"left-hand-puzzle"}
                                    fullWidth={true}
                                    value={validation.leftHandPuzzle || ETerminals.EMPTY}
                                    onChange={onLeftHandPuzzleChange}
                                    placeholder={"Выберите вопрос"}
                                >
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
                        <Grid item xs={2}>
                            {!!validation.leftHandPuzzle && (
                                <SelectField
                                    id={"operator-type"}
                                    fullWidth={true}
                                    value={validation.operatorType || ETerminals.EMPTY}
                                    onChange={onOperatorTypeChange}
                                    placeholder={"Выберите значение"}
                                >
                                    {validationService.getOperatorVariants()}
                                </SelectField>
                            )}
                        </Grid>
                        <Grid item xs={3}>
                            {!!validation.leftHandPuzzle && (
                                <SelectField
                                    id={"validation-type"}
                                    fullWidth={true}
                                    value={validation.validationType || ETerminals.EMPTY}
                                    onChange={onValidationTypeChange}
                                    placeholder={"Выберите значение"}
                                >
                                    {validationService.getValidationVariants()}
                                </SelectField>
                            )}
                        </Grid>
                        <Grid item xs>
                            {!!validation.leftHandPuzzle &&
                                validationService.getRightHandPuzzle(questions)(
                                    validation.validationType ===
                                        EValidationType.COMPARE_WITH_ANSWER
                                        ? onRightHandPuzzleChange
                                        : onValueChange
                                )}
                        </Grid>
                        <Grid item xs>
                            <Grid container justify="flex-end">
                                <Grid item>
                                    <IconButton onClick={() => onDeleteValidation(validation.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Grid>
                    </React.Fragment>
                );
            })}
            <Grid item css={theme => ({ marginLeft: theme.spacing(9) })}>
                <CustomButton
                    variant="outlined"
                    color="primary"
                    onClick={onAddValidation}
                    title={"Добавить внутреннее условие"}
                    icon={<AddIcon isActive={true} />}
                    scheme={"blueOutline"}
                    css={theme => ({
                        width: 290,
                        marginLeft: theme.spacing(0.5),
                    })}
                />
            </Grid>
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
                        <Typography variant="subtitle1">То</Typography>
                    </Grid>
                    <Grid item xs={11} css={theme => ({ marginRight: theme.spacing(2) })}>
                        <InputField fullWidth />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};
