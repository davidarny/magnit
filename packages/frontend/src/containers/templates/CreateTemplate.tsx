/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import * as React from "react";
import { useEffect, useState } from "react";
import { SectionLayout } from "components/section-layout";
import { SectionTitle } from "components/section-title";
import { Button, Grid, Paper, TextField } from "@material-ui/core";
import { Check as CheckIcon } from "@material-ui/icons";
import uuid from "uuid/v4";
import { Puzzle, PuzzleToolbar } from "components/puzzle";
import { EPuzzleType, ITemplate } from "entities/template";
import { GroupPuzzle, InputAnswerPuzzle, QuestionPuzzle, SectionPuzzle } from "./items";

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
                        puzzleType: EPuzzleType.GROUP,
                        puzzles: [
                            {
                                id: uuid(),
                                puzzleType: EPuzzleType.QUESTION,
                                title: "",
                                order: 0,
                                puzzles: [
                                    {
                                        id: uuid(),
                                        puzzleType: EPuzzleType.INPUT_ANSWER,
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
                        conditions: [],
                        validations: [],
                    },
                    {
                        id: uuid(),
                        title: "",
                        order: 1,
                        puzzleType: EPuzzleType.GROUP,
                        puzzles: [
                            {
                                id: uuid(),
                                puzzleType: EPuzzleType.QUESTION,
                                title: "",
                                order: 0,
                                puzzles: [
                                    {
                                        id: uuid(),
                                        puzzleType: EPuzzleType.INPUT_ANSWER,
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
                                puzzleType: EPuzzleType.QUESTION,
                                title: "",
                                order: 1,
                                puzzles: [
                                    {
                                        id: uuid(),
                                        puzzleType: EPuzzleType.INPUT_ANSWER,
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
                        conditions: [],
                        validations: [],
                    },
                ],
            },
            {
                id: uuid(),
                title: "",
                order: 1,
                puzzles: [
                    {
                        id: uuid(),
                        title: "",
                        order: 0,
                        puzzleType: EPuzzleType.GROUP,
                        puzzles: [
                            {
                                id: uuid(),
                                puzzleType: EPuzzleType.QUESTION,
                                title: "",
                                order: 0,
                                puzzles: [
                                    {
                                        id: uuid(),
                                        puzzleType: EPuzzleType.INPUT_ANSWER,
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
                        conditions: [],
                        validations: [],
                    },
                ],
            },
        ],
        title: "",
        description: "",
    });
    const [focusedPuzzleId, setFocusedPuzzleId] = useState<string | null>(template.id);
    const [toolbarTopPosition, setToolbarTopPosition] = useState(0);

    useEffect(() => {
        if (!focusedPuzzleId) {
            return;
        }
        const element = document.getElementById(focusedPuzzleId);
        if (!element) {
            return;
        }
        setToolbarTopPosition(element.offsetTop);

        const toolbar = document.querySelector<HTMLDivElement>(".toolbar");
        if (!toolbar) {
            return;
        }
        toolbar.style.willChange = "transform";
        setTimeout(() => (toolbar.style.willChange = "initial"));
    }, [focusedPuzzleId]);

    return (
        <SectionLayout>
            <SectionTitle title="Создание шаблона">
                <Grid item>
                    <Button variant="contained" color="primary">
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
                    position: "relative",
                })}
            >
                <PuzzleToolbar top={toolbarTopPosition} />
                <Paper
                    css={theme => ({ padding: theme.spacing(4) })}
                    id={template.id}
                    onFocus={() => setFocusedPuzzleId(template.id)}
                    elevation={focusedPuzzleId === template.id ? 16 : 0}
                >
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
                        <div
                            key={section.id}
                            id={section.id}
                            onFocus={() => setFocusedPuzzleId(section.id)}
                        >
                            <div css={theme => ({ margin: theme.spacing(4) })} />
                            <Grid
                                container
                                direction="column"
                                css={theme => ({ marginBottom: theme.spacing(2) })}
                            >
                                <Grid item>
                                    <Grid container alignItems="flex-end">
                                        <SectionPuzzle index={index} />
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Paper
                                    css={css`
                                        width: 100%;
                                    `}
                                    elevation={focusedPuzzleId === section.id ? 16 : 0}
                                >
                                    <Puzzle
                                        puzzles={section.puzzles}
                                        index={index}
                                        components={{
                                            [EPuzzleType.GROUP]: index => (
                                                <GroupPuzzle index={index} />
                                            ),
                                            [EPuzzleType.QUESTION]: index => (
                                                <QuestionPuzzle index={index} />
                                            ),
                                            [EPuzzleType.INPUT_ANSWER]: () => <InputAnswerPuzzle />,
                                        }}
                                        onFocus={id => setFocusedPuzzleId(id)}
                                        shouldElevatePuzzle={id => id === focusedPuzzleId}
                                    />
                                </Paper>
                            </Grid>
                        </div>
                    );
                })}
            </Grid>
        </SectionLayout>
    );
};
