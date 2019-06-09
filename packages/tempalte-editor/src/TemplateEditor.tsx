/** @jsx jsx */

import { jsx, css } from "@emotion/core";
import * as React from "react";
import { Puzzle, PuzzleToolbar } from "./components/puzzle";
import { Grid, Paper, TextField } from "@material-ui/core";
import { SectionPuzzle } from "./items/section-puzzle";
import { EPuzzleType, ITemplate } from "./entities";
import { GroupPuzzle } from "./items/group-puzzle";
import { QuestionPuzzle } from "./items/question-puzzle";
import { InputAnswerPuzzle } from "./items/input-answer-puzzle";
import { useState } from "react";
import uuid from "uuid/v4";
import { useEffect } from "react";

interface ITemplateEditorProps {
    initialState?: ITemplate;
}

export const TemplateEditor: React.FC<ITemplateEditorProps> = props => {
    const [template] = useState<ITemplate>(
        props.initialState || {
            id: uuid(),
            sections: [],
            title: "",
            description: "",
        }
    );
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
        <React.Fragment>
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
                                        [EPuzzleType.GROUP]: index => <GroupPuzzle index={index} />,
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
        </React.Fragment>
    );
};
