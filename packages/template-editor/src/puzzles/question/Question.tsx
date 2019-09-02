/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import { InputField, SelectField } from "@magnit/components";
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
import { EPuzzleType, ETerminals } from "@magnit/services";
import { Grid, MenuItem, Typography } from "@material-ui/core";
import { IFocusedPuzzleProps, IPuzzle, ITemplate, TChangeEvent } from "entities";
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

export const Question: React.FC<IQuestionPuzzleProps> = props => {
    const { index: index1, title, template, id, focused } = props;
    const { onTemplateChange } = props;
    const [answersType, setAnswersType] = useState((ETerminals.EMPTY as unknown) as EPuzzleType);
    const [questionTitle, setQuestionTitle] = useState(title);

    const templateSnapshot = useRef<ITemplate>({} as ITemplate);
    const answerTypeSnapshot = useRef<EPuzzleType>((ETerminals.EMPTY as unknown) as EPuzzleType);

    const onTemplateChangeCallback = useCallback(() => {
        traverse(template, (value: any) => {
            if (!_.isObject(value) || !("puzzles" in value)) {
                return;
            }
            const puzzle = value as IPuzzle;
            if (!("id" in puzzle) || puzzle.id !== id) {
                return;
            }
            // set initial answerType based on
            // first element of question children
            let nextAnswerType = answersType;
            if (!nextAnswerType) {
                const childrenHeadPuzzle = _.head(puzzle.puzzles) || {
                    puzzleType: (ETerminals.EMPTY as unknown) as EPuzzleType,
                };
                setAnswersType(childrenHeadPuzzle.puzzleType);
                nextAnswerType = childrenHeadPuzzle.puzzleType;
            }
            if (!puzzle.puzzles.length) {
                return;
            }
            // set changed puzzle type of question children
            // and strip it's length to 1 only after initial render
            if (answersType !== answerTypeSnapshot.current) {
                puzzle.puzzles.length = 1;
            }
            puzzle.puzzles = puzzle.puzzles.map(child => {
                return {
                    ...child,
                    puzzleType: nextAnswerType,
                    title: answersType === answerTypeSnapshot.current ? child.title : "",
                };
            });
            // reset conditions and validations
            puzzle.validations = [];
            puzzle.conditions = [];
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
                    const puzzle = {
                        id: uuid(),
                        puzzleType: EPuzzleType.REFERENCE_TEXT,
                        title: ETerminals.EMPTY,
                        description: ETerminals.EMPTY,
                        order: childPuzzle.puzzles.length,
                        puzzles: [],
                        conditions: [],
                        validations: [],
                    };
                    return {
                        ...childPuzzle,
                        puzzles: [
                            puzzle,
                            {
                                ...puzzle,
                                id: uuid(),
                                puzzleType: EPuzzleType.REFERENCE_ASSET,
                                order: childPuzzle.puzzles.length + 1,
                            },
                        ],
                    };
                });
            } else if (nextAnswerType !== EPuzzleType.REFERENCE_ANSWER && hasChildrenOfPuzzles) {
                puzzle.puzzles = puzzle.puzzles.map(child => {
                    return {
                        ...child,
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
        if (_.isEqual(template, templateSnapshot.current) || _.isEmpty(templateSnapshot.current)) {
            templateSnapshot.current = _.cloneDeep(template);
            return;
        }
        templateSnapshot.current = _.cloneDeep(template);
        onTemplateChange(templateSnapshot.current);
    }, [answersType, questionTitle, template, id, onTemplateChange]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => onTemplateChangeCallback(), [answersType, focused]);

    function onAnswerTypeChange(event: TChangeEvent): void {
        setAnswersType(event.target.value as EPuzzleType);
    }

    function onQuestionTitleChange(event: TChangeEvent): void {
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
                        {index1 + 1}.
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
                            {index1 + 1}.
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
                            value={answersType || ETerminals.EMPTY}
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
