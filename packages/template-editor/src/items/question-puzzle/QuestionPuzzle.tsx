/* eslint-disable react-hooks/exhaustive-deps */
/** @jsx jsx */

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { ETerminals, IPuzzle, ISpecificPuzzleProps, ITemplate } from "entities";
import { FormControl, Grid, Input, MenuItem, Select, Typography } from "@material-ui/core";
import { jsx } from "@emotion/core";
import { EPuzzleType } from "components/puzzle";
import { traverse } from "services/json";
import _ from "lodash";
import { InputField } from "../../components/fields";

interface IQuestionPuzzleProps extends ISpecificPuzzleProps {
    template: ITemplate;
    title: string;
    focused?: boolean;

    onTemplateChange(template: ITemplate): void;
}

type TChangeEvent = React.ChangeEvent<{ name?: string; value: unknown }>;

const answerTypes = [
    { label: "Текстовое поле", type: EPuzzleType.TEXT_ANSWER },
    { label: "Числовое поле", type: EPuzzleType.NUMERIC_ANSWER },
    { label: "Один из списка", type: EPuzzleType.RADIO_ANSWER },
    { label: "Несколько из списка", type: EPuzzleType.CHECKBOX_ANSWER },
    { label: "Дата", type: EPuzzleType.DATE_ANSWER },
    { label: "Выпадающий список", type: EPuzzleType.DROPDOWN_ANSWER },
];

export const QuestionPuzzle: React.FC<IQuestionPuzzleProps> = ({ template, id, ...props }) => {
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

    function onAnswerTypeChange(event: TChangeEvent): void {
        setAnswersType(event.target.value as EPuzzleType);
    }

    function onQuestionTitleChange(event: TChangeEvent): void {
        setQuestionTitle(event.target.value as string);
    }

    if (!props.focused) {
        return (
            <Grid container direction="column">
                <Grid item>
                    <Typography variant="body1">
                        <Typography
                            component="span"
                            css={theme => ({
                                paddingRight: theme.spacing(),
                            })}
                        >
                            {props.index + 1}.
                        </Typography>
                        {questionTitle}
                    </Typography>
                </Grid>
            </Grid>
        );
    }

    return (
        <Grid container direction="column">
            <Grid item xs={12}>
                <Grid container alignItems="flex-end" spacing={2}>
                    <Grid item>
                        <Typography
                            css={theme => ({
                                fontSize: theme.fontSize.medium,
                                marginBottom: theme.spacing(0.25),
                            })}
                        >
                            {props.index + 1}.
                        </Typography>
                    </Grid>
                    <Grid item xs style={{ paddingLeft: 0 }}>
                        <InputField
                            fullWidth
                            placeholder="Название вопроса"
                            value={questionTitle}
                            onChange={onQuestionTitleChange}
                        />
                    </Grid>
                    <Grid item xs={3}>
                        <FormControl fullWidth>
                            <Select
                                value={answersType}
                                input={<Input id="question-puzzle-type" />}
                                onChange={onAnswerTypeChange}
                            >
                                {answerTypes.map(({ label, type }, index) => (
                                    <MenuItem value={type} key={index}>
                                        {label}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};
