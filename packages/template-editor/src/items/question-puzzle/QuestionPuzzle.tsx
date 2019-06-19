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
import * as R from "ramda";

interface IQuestionPuzzleProps extends ISpecificPuzzleProps {
    template: ITemplate;
    title: string;

    isFocused(id: string): boolean;

    onTemplateChange(template: ITemplate): void;
}

type TChangeEvent = React.ChangeEvent<{ name?: string; value: unknown }>;

export const QuestionPuzzle: React.FC<IQuestionPuzzleProps> = ({ title, index, id, ...props }) => {
    const [conditionsEnabled, setConditionsEnabled] = useState(false);
    const [answersType, setAnswersType] = useState(EPuzzleType.TEXT_ANSWER);

    useEffect(() => {
        traverse(props.template, (value: any) => {
            if (typeof value !== "object" || !("puzzles" in value)) {
                return;
            }
            const puzzle = value as IPuzzle;
            if (!("id" in puzzle) || puzzle.id !== id) {
                return;
            }
            // set initial answerType based on
            // first element of question children
            const childrenHeadPuzzle = R.head(puzzle.puzzles) || {
                puzzleType: (ETerminals.EMPTY as unknown) as EPuzzleType,
            };
            const getPuzzleType = R.prop("puzzleType");
            setAnswersType(getPuzzleType(childrenHeadPuzzle));
        });
    });

    function onConditionsCheckboxChange(event: React.ChangeEvent<HTMLInputElement>) {
        setConditionsEnabled(event.target.checked);
    }

    function onAnswerTypeChange(event: TChangeEvent): void {
        traverse(props.template, (value: any) => {
            if (typeof value !== "object" || !("puzzles" in value)) {
                return;
            }
            const puzzle = value as IPuzzle;
            if (!("id" in puzzle) || puzzle.id !== id) {
                return;
            }
            if (!puzzle.puzzles.length) {
                return;
            }
            // set changed puzzle type of question children
            // and strip it's length to 1
            puzzle.puzzles.length = 1;
            puzzle.puzzles = puzzle.puzzles.map(childPuzzle => {
                return {
                    ...childPuzzle,
                    puzzleType: event.target.value as EPuzzleType,
                    title: "",
                };
            });
        });
        props.onTemplateChange({ ...props.template });
        setAnswersType(event.target.value as EPuzzleType);
    }

    return (
        <Grid container direction="column">
            <Grid item xs={12}>
                <Grid container spacing={4}>
                    <Grid item xs={9}>
                        <Grid container alignItems="flex-end">
                            <Grid xs={1} item>
                                <Typography variant="body1">{index + 1}.</Typography>
                            </Grid>
                            <Grid xs={11} item>
                                <TextField
                                    fullWidth
                                    label="Название вопроса"
                                    defaultValue={title}
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
                        template={props.template}
                        onTemplateChange={props.onTemplateChange}
                    />
                </Grid>
            )}
        </Grid>
    );
};
