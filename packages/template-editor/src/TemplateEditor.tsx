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
            puzzles: [],
            title: "",
            description: "",
        }
    );
    const [toolbarTopPosition, setToolbarTopPosition] = useState(0);
    const [focusedPuzzleChain, setFocusedPuzzleChain] = useState<string[]>([template.id]);
    const [isFocusOnSection, setFocusOnSectionState] = useState(false);

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

        setFocusOnSectionState(false);
        setTimeout(() => {
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
                const isSectionItem =
                    "puzzles" in value && !("puzzleType" in value) && !("sections" in value);
                if (isSectionItem) {
                    setFocusOnSectionState(true);
                }
            });
        });
    }, [focusedPuzzleChain]);

    function onToolbarAddQuestion() {
        traverse(template, (value: any) => {
            if (!focusedPuzzleChain.length) {
                return;
            }
            if (typeof value !== "object" || !("id" in value)) {
                return;
            }
            const focusedPuzzleId = R.head(focusedPuzzleChain);
            if (value.id !== focusedPuzzleId || !focusedPuzzleChain.includes(value.id)) {
                return;
            }
            const isTemplateItem = "puzzles" in value && "sections" in value;
            const isGroupItem =
                "puzzles" in value &&
                "puzzleType" in value &&
                value.puzzleType === EPuzzleType.GROUP;
            if (isTemplateItem || isGroupItem) {
                const puzzle = value as IPuzzle;
                const prevPuzzle = puzzle.puzzles[puzzle.puzzles.length - 1];
                puzzle.puzzles.push({
                    id: uuid(),
                    puzzles: [],
                    validations: [],
                    conditions: [],
                    title: "",
                    puzzleType: EPuzzleType.QUESTION,
                    order: (prevPuzzle || { order: -1 }).order + 1,
                });
            }
        });
        setTemplate({ ...template });
    }

    function onPuzzleBlur(event: React.SyntheticEvent): void {
        event.preventDefault();
        event.stopPropagation();
    }

    function onPuzzleFocus(id: string): void {
        if (focusedPuzzleChain.includes(id)) {
            setFocusedPuzzleChain([...focusedPuzzleChain]);
            return;
        }
        focusedPuzzleChain.push(id);
        setFocusedPuzzleChain([...focusedPuzzleChain]);
    }

    function onPuzzleMouseDown(event: React.SyntheticEvent): void {
        event.stopPropagation();
        setFocusedPuzzleChain([]);
    }

    const focusedPuzzleId = R.head(focusedPuzzleChain);

    return (
        <React.Fragment>
            <PuzzleToolbar
                top={toolbarTopPosition}
                onAddClick={onToolbarAddQuestion}
                addQuestionDisabled={isFocusOnSection}
            />
            <Paper
                css={theme => ({ padding: theme.spacing(4) })}
                id={template.id}
                onFocus={onPuzzleFocus.bind(null, template.id)}
                onBlur={onPuzzleBlur}
                onMouseDown={onPuzzleMouseDown}
                elevation={focusedPuzzleId === template.id ? 16 : 0}
            >
                <Grid container direction="column">
                    <Grid item>
                        <TextField fullWidth label="Название шаблона" />
                    </Grid>
                    <Grid item>
                        <TextField fullWidth label="Описание шаблона (необязательно)" />
                    </Grid>
                    <Grid item>
                        <Puzzle
                            puzzles={template.puzzles}
                            index={0}
                            components={{
                                [EPuzzleType.GROUP]: index => <GroupPuzzle index={index} />,
                                [EPuzzleType.QUESTION]: index => <QuestionPuzzle index={index} />,
                                [EPuzzleType.INPUT_ANSWER]: () => <InputAnswerPuzzle />,
                            }}
                            onFocus={onPuzzleFocus}
                            onMouseDown={onPuzzleMouseDown}
                            onBlur={onPuzzleBlur}
                            shouldElevatePuzzle={id => id === focusedPuzzleId}
                            isInFocusedChain={id => focusedPuzzleChain.includes(id)}
                        />
                    </Grid>
                </Grid>
            </Paper>
            {template.sections.map((section, index) => {
                return (
                    <div
                        key={section.id}
                        id={section.id}
                        onFocus={onPuzzleFocus.bind(null, section.id)}
                        onBlur={onPuzzleBlur}
                        onMouseDown={onPuzzleMouseDown}
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
                                    onFocus={onPuzzleFocus}
                                    onMouseDown={onPuzzleMouseDown}
                                    onBlur={onPuzzleBlur}
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
