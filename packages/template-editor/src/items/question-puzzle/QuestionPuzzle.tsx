/* eslint-disable react-hooks/exhaustive-deps */
/** @jsx jsx */

import * as React from "react";
import { useEffect, useState } from "react";
import { ETerminals, IPuzzle, ISpecificPuzzleProps, ITemplate } from "entities";
import {
    Checkbox,
    FormControl,
    FormControlLabel,
    Grid,
    Input,
    InputLabel,
    MenuItem,
    Select,
    TextField,
    Typography,
} from "@material-ui/core";
import { jsx } from "@emotion/core";
import { Conditions } from "components/conditions";
import { EPuzzleType } from "components/puzzle";
import { traverse } from "services/json";
import _ from "lodash";
import { useRef } from "react";

interface IQuestionPuzzleProps extends ISpecificPuzzleProps {
    template: ITemplate;
    title: string;

    isFocused(id: string): boolean;

    onTemplateChange(template: ITemplate): void;
}

type TChangeEvent = React.ChangeEvent<{ name?: string; value: unknown }>;

export const QuestionPuzzle: React.FC<IQuestionPuzzleProps> = ({ template, id, ...props }) => {
    const [conditionsEnabled, setConditionsEnabled] = useState(false);
    const [answersType, setAnswersType] = useState((ETerminals.EMPTY as unknown) as EPuzzleType);
    const [questionTitle, setQuestionTitle] = useState(props.title);
    const templateSnapshot = useRef<ITemplate>({} as ITemplate);
    const answerTypeSnapshot = useRef<EPuzzleType>((ETerminals.EMPTY as unknown) as EPuzzleType);

    useEffect(() => {
        traverse(template, (value: any) => {
            if (typeof value !== "object" || !("puzzles" in value)) {
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
            puzzle.puzzles = puzzle.puzzles.map(childPuzzle => {
                return {
                    ...childPuzzle,
                    puzzleType: nextAnswerType,
                    title: answersType === answerTypeSnapshot.current ? childPuzzle.title : "",
                };
            });
            puzzle.title = questionTitle;
            answerTypeSnapshot.current = nextAnswerType;
        });
        // trigger template update if snapshot changed
        // also cloneDeep in order to track changes above in isEqual
        if (_.isEqual(template, templateSnapshot.current) || _.isEmpty(templateSnapshot.current)) {
            templateSnapshot.current = _.cloneDeep(template);
            return;
        }
        templateSnapshot.current = _.cloneDeep(template);
        props.onTemplateChange(templateSnapshot.current);
    }, [answersType, questionTitle, template]);

    function onConditionsCheckboxChange(event: React.ChangeEvent<HTMLInputElement>) {
        setConditionsEnabled(event.target.checked);
    }

    function onAnswerTypeChange(event: TChangeEvent): void {
        setAnswersType(event.target.value as EPuzzleType);
    }

    function onQuestionTitleChange(event: TChangeEvent): void {
        setQuestionTitle(event.target.value as string);
    }

    return (
        <Grid container direction="column">
            <Grid item xs={12}>
                <Grid container spacing={4}>
                    <Grid item xs={9}>
                        <Grid container alignItems="flex-end">
                            <Grid xs={1} item>
                                <Typography variant="body1">{props.index + 1}.</Typography>
                            </Grid>
                            <Grid xs={11} item>
                                <TextField
                                    fullWidth
                                    label="Название вопроса"
                                    value={questionTitle}
                                    onChange={onQuestionTitleChange}
                                />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={3}>
                        <FormControl fullWidth>
                            <InputLabel htmlFor="question-puzzle-type">Выберите вопрос</InputLabel>
                            <Select
                                value={answersType}
                                input={<Input id="question-puzzle-type" />}
                                onChange={onAnswerTypeChange}
                            >
                                <MenuItem value={EPuzzleType.TEXT_ANSWER}>Текстовое поле</MenuItem>
                                <MenuItem value={EPuzzleType.NUMERIC_ANSWER}>
                                    Числовое поле
                                </MenuItem>
                                <MenuItem value={EPuzzleType.REFERENCE_ANSWER}>
                                    Справочное поле
                                </MenuItem>
                                <MenuItem value={EPuzzleType.RADIO_ANSWER}>Один из списка</MenuItem>
                                <MenuItem value={EPuzzleType.CHECKBOX_ANSWER}>
                                    Несколько из списка
                                </MenuItem>
                                <MenuItem value={EPuzzleType.UPLOAD_FILES}>
                                    Загрузка файлов
                                </MenuItem>
                                <MenuItem value={EPuzzleType.DATE_ANSWER}>Дата</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                {props.isFocused(id) && (
                    <FormControlLabel
                        css={theme => ({ marginTop: theme.spacing(2) })}
                        control={
                            <Checkbox
                                checked={conditionsEnabled}
                                onChange={onConditionsCheckboxChange}
                                color="primary"
                            />
                        }
                        label="Условия показа группы"
                    />
                )}
            </Grid>
            {conditionsEnabled && (
                <Grid
                    xs={12}
                    css={theme => ({
                        marginTop: theme.spacing(2),
                        opacity: !props.isFocused(id) ? 0.5 : 1,
                        pointerEvents: !props.isFocused(id) ? "none" : "initial",
                    })}
                    item
                >
                    <Conditions
                        puzzleId={id}
                        template={template}
                        onTemplateChange={props.onTemplateChange}
                    />
                </Grid>
            )}
        </Grid>
    );
};
