/** @jsx jsx */

import { jsx } from "@emotion/core";
import * as React from "react";
import { SectionLayout } from "components/section-layout";
import { SectionTitle } from "components/section-title";
import { Button, Grid, Paper, TextField } from "@material-ui/core";
import { Check as CheckIcon } from "@material-ui/icons";
import { useState } from "react";
import uuid from "uuid/v4";
import { Puzzle } from "components/puzzle";
import { ITemplate } from "entities/template";
import { WithToolbar } from "components/with-toolbar";
import { SectionPuzzle, GroupPuzzle, QuestionPuzzle } from "./items";

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
                    <WithToolbar>
                        <Grid container direction="column">
                            <Grid item>
                                <TextField fullWidth label="Название шаблона" />
                            </Grid>
                            <Grid item>
                                <TextField fullWidth label="Описание шаблона (необязательно)" />
                            </Grid>
                        </Grid>
                    </WithToolbar>
                </Paper>
                {template.sections.map((section, index) => {
                    return (
                        <div key={section.id}>
                            <div css={theme => ({ margin: theme.spacing(4) })} />
                            <Grid
                                container
                                direction="column"
                                css={theme => ({ marginBottom: theme.spacing(2) })}
                            >
                                <WithToolbar right={32}>
                                    <Grid item>
                                        <Grid container alignItems="flex-end">
                                            <SectionPuzzle index={index} />
                                        </Grid>
                                    </Grid>
                                </WithToolbar>
                            </Grid>
                            <Grid container>
                                <Paper
                                    css={theme => ({ width: "100%", padding: theme.spacing(4) })}
                                >
                                    <Puzzle
                                        puzzles={section.puzzles}
                                        index={index}
                                        components={{
                                            group: index => <GroupPuzzle index={index} />,
                                            question: index => <QuestionPuzzle index={index} />,
                                        }}
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
