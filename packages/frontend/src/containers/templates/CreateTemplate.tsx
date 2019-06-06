/** @jsx jsx */

import { jsx, css } from "@emotion/core";
import * as React from "react";
import { SectionLayout } from "components/section-layout";
import { SectionTitle } from "components/section-title";
import { Button, Grid, Paper, TextField, Typography } from "@material-ui/core";
import { Check as CheckIcon } from "@material-ui/icons";
import { useState } from "react";
import uuid from "uuid/v4";

interface ITitled {
    title: string;
}

interface IOrdered {
    order: number;
}

interface IWithId {
    id: string;
}

interface IWithPuzzles<T> {
    puzzles: T[];
}

interface IWithConditions<T> {
    conditions: T[];
}

interface IWithValidation<T> {
    validations: T[];
}

interface ICondition extends IOrdered {
    parentPuzzle: IPuzzle["id"];
    childPuzzle: IPuzzle["id"];
    actionType: "chosen_answer";
    conditionType: "and" | "or";
}

interface IValidation extends IOrdered {
    leftHandPuzzle: IPuzzle["id"];
    rightHandPuzzle?: IPuzzle["id"];
    value?: number;
    operatorType: "more_than" | "less_than" | "equal" | "less_or_equal" | "more_or_equal";
    validationType: "compare_with_answer" | "set_value";
    errorMessage: string;
}

interface ITemplate extends ITitled, IWithId {
    description: string;
    sections: ISection[];
}

interface ISection extends IOrdered, ITitled, IWithPuzzles<IPuzzle>, IWithId {
    puzzles: IPuzzle[];
}

interface IPuzzle
    extends IOrdered,
        ITitled,
        IWithPuzzles<IPuzzle>,
        IWithId,
        IWithConditions<ICondition>,
        IWithValidation<IValidation> {
    puzzleType: "group" | "question" | "radio_answer" | "dropdown_answer" | "input_answer";
}

export const CreateTemplate: React.FC = () => {
    const [template] = useState<ITemplate>({
        id: uuid(),
        sections: [
            {
                id: uuid(),
                title: "",
                order: 0,
                puzzles: [
                    {
                        id: uuid(),
                        title: "",
                        order: 0,
                        puzzleType: "group",
                        puzzles: [
                            {
                                id: uuid(),
                                puzzleType: "question",
                                title: "",
                                order: 0,
                                puzzles: [],
                                conditions: [],
                                validations: [],
                            },
                        ],
                        conditions: [],
                        validations: [],
                    },
                    {
                        id: uuid(),
                        title: "",
                        order: 0,
                        puzzleType: "group",
                        puzzles: [
                            {
                                id: uuid(),
                                puzzleType: "question",
                                title: "",
                                order: 0,
                                puzzles: [],
                                conditions: [],
                                validations: [],
                            },
                            {
                                id: uuid(),
                                puzzleType: "question",
                                title: "",
                                order: 0,
                                puzzles: [],
                                conditions: [],
                                validations: [],
                            },
                        ],
                        conditions: [],
                        validations: [],
                    },
                    {
                        id: uuid(),
                        title: "",
                        order: 0,
                        puzzleType: "group",
                        puzzles: [],
                        conditions: [],
                        validations: [],
                    },
                ],
            },
            {
                id: uuid(),
                title: "",
                order: 0,
                puzzles: [
                    {
                        id: uuid(),
                        title: "",
                        order: 0,
                        puzzleType: "group",
                        puzzles: [
                            {
                                id: uuid(),
                                puzzleType: "question",
                                title: "",
                                order: 0,
                                puzzles: [],
                                conditions: [],
                                validations: [],
                            },
                        ],
                        conditions: [],
                        validations: [],
                    },
                ],
            },
        ],
        title: "",
        description: "",
    });

    return (
        <SectionLayout>
            <SectionTitle title="Создание шаблона">
                <Grid item>
                    <Button disabled variant="contained" color="primary">
                        <CheckIcon
                            css={theme => ({ marginRight: theme.spacing() })}
                            alignmentBaseline="middle"
                        />
                        <span>Сохранить</span>
                    </Button>
                </Grid>
            </SectionTitle>
            <Grid
                item
                css={theme => ({
                    maxWidth: theme.maxTemplateWidth,
                    margin: theme.spacing(4),
                })}
            >
                <Paper css={theme => ({ padding: theme.spacing(4) })}>
                    <Grid container direction="column">
                        <Grid item>
                            <TextField fullWidth label="Название шаблона" />
                        </Grid>
                        <Grid item>
                            <TextField fullWidth label="Описание шаблона (необязательно)" />
                        </Grid>
                    </Grid>
                </Paper>
                {template.sections.map((section, index) => {
                    return (
                        <>
                            <div css={theme => ({ margin: theme.spacing(4) })} />
                            <Grid
                                container
                                direction="column"
                                key={section.id}
                                css={theme => ({ marginBottom: theme.spacing(2) })}
                            >
                                <Grid item>
                                    <Grid container alignItems="flex-end">
                                        <Grid
                                            item
                                            css={theme => ({ marginRight: theme.spacing(2) })}
                                        >
                                            <Typography variant="subtitle2">
                                                Раздел {index + 1}.
                                            </Typography>
                                        </Grid>
                                        <Grid
                                            item
                                            css={css`
                                                flex-grow: 1;
                                            `}
                                        >
                                            <TextField fullWidth label="Название раздела" />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Paper
                                    css={theme => ({ width: "100%", padding: theme.spacing(4) })}
                                >
                                    <Puzzle puzzles={section.puzzles} index={index} />
                                </Paper>
                            </Grid>
                        </>
                    );
                })}
            </Grid>
        </SectionLayout>
    );
};

interface IPuzzleProps {
    puzzles: IPuzzle[];
    index: number;
}

const Puzzle: React.FC<IPuzzleProps> = ({ puzzles }) => {
    return (
        <>
            {puzzles.map((puzzle, index) => {
                switch (puzzle.puzzleType) {
                    case "group": {
                        return (
                            <>
                                <Grid
                                    container
                                    direction="column"
                                    key={puzzle.id}
                                    css={theme => ({
                                        marginBottom: theme.spacing(2),
                                        marginTop: theme.spacing(index ? 6 : 0),
                                    })}
                                >
                                    <Grid item>
                                        <Grid container alignItems="flex-end">
                                            <Grid
                                                item
                                                css={theme => ({ marginRight: theme.spacing(2) })}
                                            >
                                                <Typography variant="subtitle2">
                                                    Группа {index + 1}.
                                                </Typography>
                                            </Grid>
                                            <Grid
                                                item
                                                css={css`
                                                    flex-grow: 1;
                                                `}
                                            >
                                                <TextField fullWidth label="Название группы" />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Puzzle puzzles={puzzle.puzzles} index={index} />
                            </>
                        );
                    }
                    case "question": {
                        return (
                            <>
                                <Grid
                                    container
                                    direction="column"
                                    key={puzzle.id}
                                    css={theme => ({ marginBottom: theme.spacing(2) })}
                                >
                                    <Grid item>
                                        <Grid container alignItems="flex-end">
                                            <Grid
                                                item
                                                css={theme => ({ marginRight: theme.spacing(2) })}
                                            >
                                                <Typography variant="subtitle2">
                                                    {index + 1}.
                                                </Typography>
                                            </Grid>
                                            <Grid
                                                item
                                                css={css`
                                                    flex-grow: 1;
                                                `}
                                            >
                                                <TextField fullWidth label="Название вопроса" />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Puzzle puzzles={puzzle.puzzles} index={index} />
                            </>
                        );
                    }
                    default:
                        return null;
                }
            })}
        </>
    );
};
