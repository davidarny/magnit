/** @jsx jsx */

import { jsx } from "@emotion/core";
import { InputField, SelectField } from "@magnit/components";
import { EPuzzleType, IFocusedPuzzleProps, IPuzzle } from "@magnit/entities";
import {
    CalendarIcon,
    CheckboxIcon,
    DropdownIcon,
    NumericFieldIcon,
    RadioIcon,
    ReferenceFieldIcon,
    TextFieldIcon,
    UploadFilesIcon,
} from "@magnit/icons";
import { Grid, MenuItem, Typography } from "@material-ui/core";
import _ from "lodash";
import * as React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import uuid from "uuid/v4";

interface IQuestionPuzzleProps extends IFocusedPuzzleProps {
    title: string;
    puzzle: IPuzzle;

    onTemplateChange(): void;
}

const answerMenuItems = [
    { label: "Текстовое поле", type: EPuzzleType.TEXT_ANSWER, icon: TextFieldIcon },
    { label: "Числовое поле", type: EPuzzleType.NUMERIC_ANSWER, icon: NumericFieldIcon },
    { label: "Один из списка", type: EPuzzleType.RADIO_ANSWER, icon: RadioIcon },
    { label: "Несколько из списка", type: EPuzzleType.CHECKBOX_ANSWER, icon: CheckboxIcon },
    { label: "Дата", type: EPuzzleType.DATE_ANSWER, icon: CalendarIcon },
    { label: "Выпадающий список", type: EPuzzleType.DROPDOWN_ANSWER, icon: DropdownIcon },
    { label: "Загрузка файлов", type: EPuzzleType.UPLOAD_FILES, icon: UploadFilesIcon },
    { label: "Справочное поле", type: EPuzzleType.REFERENCE_ANSWER, icon: ReferenceFieldIcon },
];

type TSelectChangeEvent = React.ChangeEvent<{
    name?: string;
    value: unknown;
}>;

export const Question: React.FC<IQuestionPuzzleProps> = props => {
    const { index, title, focused, onTemplateChange, puzzle } = props;

    const [answersType, setAnswersType] = useState<EPuzzleType | "">("");
    const [questionTitle, setQuestionTitle] = useState(title);

    const prevAnswerType = useRef("");
    useEffect(() => {
        if (!focused) {
            return;
        }
        const childrenHeadPuzzle = _.first(puzzle.puzzles) || { puzzleType: "" };
        const answersType = childrenHeadPuzzle.puzzleType;
        if (answersType && prevAnswerType.current !== answersType) {
            prevAnswerType.current = answersType;
            setAnswersType(answersType);
        }
    }, [focused, puzzle.puzzles]);

    const onAnswerTypeChangeCallback = useCallback(
        (event: TSelectChangeEvent): void => {
            const answersType = event.target.value as EPuzzleType;
            if (!puzzle.puzzles.length) {
                return;
            }
            puzzle.validations = [];
            puzzle.conditions = [];
            puzzle.puzzles.length = 1;
            puzzle.puzzles = puzzle.puzzles.map(childPuzzle => {
                return {
                    ...childPuzzle,
                    puzzleType: answersType,
                    title: "",
                };
            });
            const hasChildrenOfPuzzles = puzzle.puzzles.reduce((prev, curr) => {
                if (prev) {
                    return prev;
                }
                return !!(curr.puzzles || []).length;
            }, false);
            if (answersType === EPuzzleType.REFERENCE_ANSWER && !hasChildrenOfPuzzles) {
                puzzle.puzzles = puzzle.puzzles.map(childPuzzle => {
                    return {
                        ...childPuzzle,
                        puzzles: [
                            {
                                id: uuid(),
                                puzzleType: EPuzzleType.REFERENCE_TEXT,
                                title: "",
                                description: "",
                                order: childPuzzle.puzzles.length,
                                puzzles: [],
                                conditions: [],
                                validations: [],
                            },
                        ],
                    };
                });
            } else if (answersType !== EPuzzleType.REFERENCE_ANSWER && hasChildrenOfPuzzles) {
                puzzle.puzzles = puzzle.puzzles.map(childPuzzle => {
                    return {
                        ...childPuzzle,
                        puzzles: [],
                    };
                });
            }
            setAnswersType(answersType);
            onTemplateChange();
        },
        [onTemplateChange, puzzle.conditions, puzzle.puzzles, puzzle.validations],
    );

    function onQuestionTitleChange(event: TSelectChangeEvent): void {
        setQuestionTitle(event.target.value as string);
    }

    const onTitleBlurCallback = useCallback(() => {
        puzzle.title = questionTitle;
        if (onTemplateChange) {
            onTemplateChange();
        }
    }, [onTemplateChange, puzzle.title, questionTitle]);

    if (!focused) {
        return (
            <Grid
                container
                alignItems="center"
                css={theme => ({
                    // need for correct toolbar positioning
                    // see https://github.com/DavidArutiunian/magnit/issues/46
                    marginTop: theme.spacing(-2),
                })}
            >
                <Grid item>
                    <Typography
                        component="span"
                        variant="body1"
                        css={theme => ({ paddingRight: theme.spacing() })}
                    >
                        {index + 1}.
                    </Typography>
                </Grid>
                <Grid item>
                    <Typography
                        variant="body1"
                        component="span"
                        css={theme => ({ color: !questionTitle ? theme.colors.gray : "initial" })}
                    >
                        {questionTitle || "Введите вопрос"}
                    </Typography>
                </Grid>
            </Grid>
        );
    }

    return (
        <Grid container direction="column">
            <Grid item xs={12}>
                <Grid
                    container
                    alignItems="center"
                    spacing={2}
                    css={theme => ({
                        marginBottom: `${theme.spacing()} !important`,
                        // need for correct toolbar positioning
                        // see https://github.com/DavidArutiunian/magnit/issues/46
                        marginTop: `${theme.spacing(-2)} !important`,
                    })}
                >
                    <Grid item>
                        <Typography
                            css={theme => ({
                                fontSize: theme.fontSize.medium,
                                marginBottom: theme.spacing(0.25),
                            })}
                        >
                            {index + 1}.
                        </Typography>
                    </Grid>
                    <Grid item xs css={{ paddingLeft: 0 }}>
                        <InputField
                            fullWidth
                            placeholder="Введите вопрос"
                            value={questionTitle}
                            onChange={onQuestionTitleChange}
                            onBlur={onTitleBlurCallback}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <SelectField
                            fullWidth
                            value={answersType}
                            onChange={onAnswerTypeChangeCallback}
                        >
                            {answerMenuItems.map(({ label, type, icon: Icon }, index) => (
                                <MenuItem value={type} key={index}>
                                    <Icon
                                        css={theme => ({
                                            marginRight: theme.spacing(1.5),
                                            verticalAlign: "middle",
                                        })}
                                    />
                                    <Typography component="span">{label}</Typography>
                                </MenuItem>
                            ))}
                        </SelectField>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};
