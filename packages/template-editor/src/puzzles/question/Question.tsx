/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import { InputField, SelectField } from "@magnit/components";
import { EPuzzleType, IFocusedPuzzleProps, IPuzzle, ITemplate } from "@magnit/entities";
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
import { traverse } from "services/json";
import uuid from "uuid/v4";

interface IQuestionPuzzleProps extends IFocusedPuzzleProps {
    template: ITemplate;
    title: string;

    onTemplateChange(template: ITemplate): void;
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
    const { index, title, template, id, focused } = props;
    const { onTemplateChange } = props;
    const [answersType, setAnswersType] = useState<EPuzzleType | "">("");
    const [questionTitle, setQuestionTitle] = useState(title);

    const templateSnapshot = useRef<ITemplate>({} as ITemplate);
    const answerTypeSnapshot = useRef<EPuzzleType | "">("");

    const onTemplateChangeCallback = useCallback(() => {
        traverse(template, (puzzle: IPuzzle) => {
            if (
                !_.isObject(puzzle) ||
                !("puzzles" in puzzle) ||
                !("id" in puzzle) ||
                puzzle.id !== id
            ) {
                return;
            }
            // set initial answerType based on
            // first element of question children
            let nextAnswerType = answersType;
            if (!nextAnswerType) {
                const childrenHeadPuzzle = _.head(puzzle.puzzles) || { puzzleType: "" };
                setAnswersType(childrenHeadPuzzle.puzzleType);
                nextAnswerType = childrenHeadPuzzle.puzzleType;
            }
            if (!puzzle.puzzles.length) {
                return;
            }
            // set changed puzzle type of question children
            // and strip it's length to 1 only after initial render
            // clear validation & conditions
            if (answersType !== answerTypeSnapshot.current) {
                puzzle.validations = [];
                puzzle.conditions = [];
                puzzle.puzzles.length = 1;
            }
            puzzle.puzzles = puzzle.puzzles.map(childPuzzle => {
                return {
                    ...childPuzzle,
                    puzzleType: nextAnswerType,
                    title: answersType === answerTypeSnapshot.current ? childPuzzle.title : "",
                };
            });
            // check if there are nested children of answer
            // if there aren't any, we proceed with adding stub ones
            const hasChildrenOfPuzzles = puzzle.puzzles.reduce((prev, curr) => {
                if (prev) {
                    return prev;
                }
                return !!(curr.puzzles || []).length;
            }, false);
            // REFERENCE_ANSWER needs specific handling as it's nested answer
            // so we have to add it's children when choosing this type
            if (nextAnswerType === EPuzzleType.REFERENCE_ANSWER && !hasChildrenOfPuzzles) {
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
            } else if (nextAnswerType !== EPuzzleType.REFERENCE_ANSWER && hasChildrenOfPuzzles) {
                puzzle.puzzles = puzzle.puzzles.map(childPuzzle => {
                    return {
                        ...childPuzzle,
                        puzzles: [],
                    };
                });
            }
            puzzle.title = questionTitle;
            answerTypeSnapshot.current = nextAnswerType;
            return true;
        });
        // trigger template update if snapshot changed
        // also cloneDeep in order to track changes above in isEqual
        const clonedTemplate = _.cloneDeep(template);
        if (_.isEqual(template, templateSnapshot.current) || _.isEmpty(templateSnapshot.current)) {
            templateSnapshot.current = clonedTemplate;
            return;
        }
        templateSnapshot.current = clonedTemplate;
        onTemplateChange(clonedTemplate);
    }, [answersType, questionTitle, template, id, onTemplateChange]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => onTemplateChangeCallback(), [answersType, focused]);

    function onAnswerTypeChange(event: TSelectChangeEvent): void {
        setAnswersType(event.target.value as EPuzzleType);
    }

    function onQuestionTitleChange(event: TSelectChangeEvent): void {
        setQuestionTitle(event.target.value as string);
    }

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
                    <Grid
                        item
                        xs
                        css={css`
                            padding-left: 0;
                        `}
                    >
                        <InputField
                            fullWidth
                            placeholder="Введите вопрос"
                            value={questionTitle}
                            onChange={onQuestionTitleChange}
                            onBlur={onTemplateChangeCallback}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <SelectField
                            id="question-puzzle-type"
                            fullWidth={true}
                            value={answersType || ""}
                            onChange={onAnswerTypeChange}
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
