/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import * as React from "react";
import { useEffect, useState } from "react";
import { IPuzzle, ITemplate } from "./entities";
import { Grid, Paper, TextField } from "@material-ui/core";
import { SectionPuzzle } from "./items/section-puzzle";
import { GroupPuzzle } from "./items/group-puzzle";
import { QuestionPuzzle } from "./items/question-puzzle";
import { EPuzzleType, Puzzle, PuzzleToolbar } from "./components/puzzle";
import { InputAnswerPuzzle } from "./items/input-answer-puzzle";
import uuid from "uuid/v4";
import { traverse } from "./services/json";
import * as R from "ramda";

interface ITemplateEditorProps {
    initialState?: ITemplate;
}

export const TemplateEditor: React.FC<ITemplateEditorProps> = props => {
    const [template, setTemplate] = useState<ITemplate>(
        props.initialState || {
            id: uuid(),
            sections: [],
            title: "",
            description: "",
        }
    );
    const [toolbarTopPosition, setToolbarTopPosition] = useState(0);
    const [focusedPuzzleChain, setFocusedPuzzleChain] = useState<string[]>([]);
    const [isOverToolbar, setOverToolbarState] = useState(false);

    useEffect(() => {
        // set toolbar offset top
        if (!focusedPuzzleChain.length) {
            return;
        }
        const focusedPuzzleId = R.head(focusedPuzzleChain);
        if (!focusedPuzzleId) {
            return;
        }
        const element = document.getElementById(focusedPuzzleId);
        if (!element) {
            return;
        }
        const { top } = element.getBoundingClientRect();
        setToolbarTopPosition(window.scrollY + top - 128);

        // toggle toolbar will-change property
        const toolbar = document.querySelector<HTMLDivElement>(".toolbar");
        if (!toolbar) {
            return;
        }
        toolbar.style.willChange = "transform";
        const timeout = 300;
        setTimeout(() => (toolbar.style.willChange = "initial"), timeout);
    }, [focusedPuzzleChain]);

    function onToolbarAdd() {
        traverse(template, (value: any) => {
            if (!focusedPuzzleChain.length) {
                return;
            }
            if (typeof value !== "object" || !("id" in value)) {
                return;
            }
            const focusedPuzzleId = R.head(focusedPuzzleChain);
            if (value.id !== focusedPuzzleId) {
                return;
            }
            if ("puzzles" in value) {
                const puzzle = value as IPuzzle;
                const prevPuzzle = puzzle.puzzles[puzzle.puzzles.length - 1];
                let nextPuzzleType: EPuzzleType | undefined;
                if (puzzle.puzzleType === EPuzzleType.GROUP) {
                    nextPuzzleType = EPuzzleType.QUESTION;
                } else if (typeof puzzle.puzzleType === "undefined") {
                    nextPuzzleType = EPuzzleType.GROUP;
                }
                if (nextPuzzleType) {
                    puzzle.puzzles.push({
                        id: uuid(),
                        puzzles: [],
                        validations: [],
                        conditions: [],
                        title: "",
                        puzzleType: nextPuzzleType,
                        order: (prevPuzzle || { order: -1 }).order + 1,
                    });
                }
            } else if ("sections" in value) {
                // TODO: add section
            }
        });
        setTemplate({ ...template });
    }

    const focusedPuzzleId = R.head(focusedPuzzleChain);

    return (
        <React.Fragment>
            <PuzzleToolbar
                top={toolbarTopPosition}
                onAddClick={onToolbarAdd}
                onMouseOver={() => setOverToolbarState(true)}
                onMouseOut={() => setOverToolbarState(false)}
            />
            <Paper
                css={theme => ({ padding: theme.spacing(4) })}
                id={template.id}
                onFocus={() => {
                    if (focusedPuzzleChain.includes(template.id)) {
                        setFocusedPuzzleChain([...focusedPuzzleChain]);
                        return;
                    }
                    focusedPuzzleChain.push(template.id);
                    setFocusedPuzzleChain([...focusedPuzzleChain]);
                }}
                onBlur={event => {
                    if (isOverToolbar) {
                        event.preventDefault();
                        event.stopPropagation();
                    } else {
                        setFocusedPuzzleChain([]);
                    }
                }}
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
                        onFocus={() => {
                            if (focusedPuzzleChain.includes(section.id)) {
                                setFocusedPuzzleChain([...focusedPuzzleChain]);
                                return;
                            }
                            focusedPuzzleChain.push(section.id);
                            setFocusedPuzzleChain([...focusedPuzzleChain]);
                        }}
                        onBlur={event => {
                            if (isOverToolbar) {
                                event.preventDefault();
                                event.stopPropagation();
                            } else {
                                setFocusedPuzzleChain([]);
                            }
                        }}
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
                                    onFocus={id => {
                                        if (focusedPuzzleChain.includes(id)) {
                                            setFocusedPuzzleChain([...focusedPuzzleChain]);
                                            return;
                                        }
                                        focusedPuzzleChain.push(id);
                                        setFocusedPuzzleChain([...focusedPuzzleChain]);
                                    }}
                                    onBlur={event => {
                                        if (isOverToolbar) {
                                            event.preventDefault();
                                            event.stopPropagation();
                                        } else {
                                            setFocusedPuzzleChain([]);
                                        }
                                    }}
                                    shouldElevatePuzzle={id => id === focusedPuzzleId}
                                    isInFocusedChain={id => focusedPuzzleChain.includes(id)}
                                />
                            </Paper>
                        </Grid>
                    </div>
                );
            })}
        </React.Fragment>
    );
};
