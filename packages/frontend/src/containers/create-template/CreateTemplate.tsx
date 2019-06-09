/** @jsx jsx */

import { jsx } from "@emotion/core";
import * as React from "react";
import { SectionLayout } from "components/section-layout";
import { SectionTitle } from "components/section-title";
import { Button, Grid } from "@material-ui/core";
import { Check as CheckIcon } from "@material-ui/icons";
import { EPuzzleType, TemplateEditor } from "@magnit/template-editor";
import uuid from "uuid/v4";

export const CreateTemplate: React.FC = () => {
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
                <TemplateEditor
                    initialState={{
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
                    }}
                />
            </Grid>
        </SectionLayout>
    );
};
