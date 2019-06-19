/** @jsx jsx */

import { css, jsx } from "@emotion/core";
import * as React from "react";
import { useEffect, useState } from "react";
import { ETerminals, IPuzzle, ITemplate } from "./entities";
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
            title: ETerminals.EMPTY,
            description: ETerminals.EMPTY,
        }
    );
    const [toolbarTopPosition, setToolbarTopPosition] = useState(0);
    const [focusedPuzzleChain, setFocusedPuzzleChain] = useState<string[]>([template.id]);

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

    function onToolbarAddQuestion(): void {
        const whitelist = [EPuzzleType.GROUP];
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
            // do not allow to add question in section, question, answer, etc...
            if ("puzzleType" in value && !whitelist.includes(value.puzzleType)) {
                return;
            }
            const puzzle = value as IPuzzle;
            const prevPuzzle = puzzle.puzzles[puzzle.puzzles.length - 1];
            puzzle.puzzles.push({
                id: uuid(),
                puzzles: [
                    {
                        id: uuid(),
                        puzzleType: EPuzzleType.TEXT_ANSWER,
                        title: ETerminals.EMPTY,
                        description: ETerminals.EMPTY,
                        order: 0,
                        puzzles: [],
                        conditions: [],
                        validations: [],
                    },
                ],
                validations: [],
                conditions: [],
                title: ETerminals.EMPTY,
                description: ETerminals.EMPTY,
                puzzleType: EPuzzleType.QUESTION,
                order: (prevPuzzle || { order: -1 }).order + 1,
            });
        });
        setTemplate({ ...template });
    }

    function onToolbarAddGroup(): void {
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
            // do not allow to add group in group, question, etc...
            if ("puzzleType" in value) {
                return;
            }
            const puzzle = value as IPuzzle;
            const nearPuzzlesToGroup: IPuzzle[] = [];
            if (
                "puzzles" in value &&
                "sections" in value &&
                !template.puzzles.some(puzzle => puzzle.puzzleType === EPuzzleType.GROUP)
            ) {
                nearPuzzlesToGroup.push(
                    ...puzzle.puzzles.filter(puzzle => puzzle.puzzleType === EPuzzleType.QUESTION)
                );
                puzzle.puzzles = [];
            }
            const prevPuzzle = puzzle.puzzles[puzzle.puzzles.length - 1];
            puzzle.puzzles.push({
                id: uuid(),
                puzzles: [...nearPuzzlesToGroup],
                validations: [],
                conditions: [],
                description: ETerminals.EMPTY,
                title: ETerminals.EMPTY,
                puzzleType: EPuzzleType.GROUP,
                order: (prevPuzzle || { order: -1 }).order + 1,
            });
        });
        setTemplate({ ...template });
    }

    function onToolbarAddSection(): void {
        const prevSection = template.sections[template.sections.length - 1];
        template.sections.push({
            id: uuid(),
            puzzles: [
                {
                    id: uuid(),
                    puzzles: [],
                    validations: [],
                    conditions: [],
                    description: ETerminals.EMPTY,
                    title: ETerminals.EMPTY,
                    puzzleType: EPuzzleType.GROUP,
                    order: 0,
                },
            ],
            title: ETerminals.EMPTY,
            order: (prevSection || { order: -1 }).order + 1,
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

    function onPuzzleMouseDown(event: React.SyntheticEvent, id: string): void {
        event.stopPropagation();
        const focusedPuzzleId = R.head(focusedPuzzleChain);
        if (id === focusedPuzzleId) {
            return;
        }
        setFocusedPuzzleChain([]);
    }

    function onTemplateChange(template: ITemplate) {
        setTemplate({ ...template });
    }

    const focusedPuzzleId = R.head(focusedPuzzleChain);

    return (
        <React.Fragment>
            <PuzzleToolbar
                top={toolbarTopPosition}
                onAddClick={onToolbarAddQuestion}
                onAddGroup={onToolbarAddGroup}
                onAddSection={onToolbarAddSection}
            />
            <Paper
                css={theme => ({
                    paddingTop: theme.spacing(4),
                    paddingBottom: template.puzzles.some(
                        puzzle => puzzle.puzzleType === EPuzzleType.GROUP
                    )
                        ? theme.spacing(0)
                        : theme.spacing(4),
                })}
                id={template.id}
                onFocus={onPuzzleFocus.bind(null, template.id)}
                onBlur={onPuzzleBlur}
                onMouseDown={event => onPuzzleMouseDown(event, template.id)}
                elevation={focusedPuzzleId === template.id ? 16 : 0}
            >
                <Grid container direction="column">
                    <Grid
                        item
                        css={theme => ({
                            paddingLeft: theme.spacing(4),
                            paddingRight: theme.spacing(4),
                        })}
                    >
                        <TextField
                            fullWidth
                            label="Название шаблона"
                            defaultValue={template.title}
                        />
                    </Grid>
                    <Grid
                        item
                        css={theme => ({
                            paddingLeft: theme.spacing(4),
                            paddingRight: theme.spacing(4),
                        })}
                    >
                        <TextField
                            fullWidth
                            label="Описание шаблона (необязательно)"
                            defaultValue={template.description}
                        />
                    </Grid>
                    <Grid item>
                        <Puzzle
                            puzzles={template.puzzles}
                            index={0}
                            components={{
                                [EPuzzleType.GROUP]: index => (
                                    <GroupPuzzle
                                        template={template}
                                        isFocused={id => id === focusedPuzzleId}
                                        id={template.id}
                                        index={index}
                                        onTemplateChange={onTemplateChange}
                                    />
                                ),
                                [EPuzzleType.QUESTION]: index => (
                                    <QuestionPuzzle
                                        template={template}
                                        isFocused={id => id === focusedPuzzleId}
                                        title={template.title}
                                        id={template.id}
                                        index={index}
                                        onTemplateChange={onTemplateChange}
                                    />
                                ),
                                [EPuzzleType.TEXT_ANSWER]: index => (
                                    <InputAnswerPuzzle id={template.id} index={index} />
                                ),
                            }}
                            onFocus={onPuzzleFocus}
                            onMouseDown={event => onPuzzleMouseDown(event, template.id)}
                            onBlur={onPuzzleBlur}
                            isFocused={id => id === focusedPuzzleId}
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
                        onMouseDown={event => onPuzzleMouseDown(event, section.id)}
                    >
                        <div css={theme => ({ margin: theme.spacing(4) })} />
                        <Grid
                            container
                            direction="column"
                            css={theme => ({ marginBottom: theme.spacing(2) })}
                        >
                            <Grid item>
                                <Grid container alignItems="flex-end">
                                    <SectionPuzzle
                                        title={section.title}
                                        id={section.id}
                                        index={index}
                                    />
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
                                        [EPuzzleType.GROUP]: (index, id) => (
                                            <GroupPuzzle
                                                template={template}
                                                isFocused={id => id === focusedPuzzleId}
                                                id={id}
                                                index={index}
                                                onTemplateChange={onTemplateChange}
                                            />
                                        ),
                                        [EPuzzleType.QUESTION]: (index, id, title) => (
                                            <QuestionPuzzle
                                                template={template}
                                                isFocused={id => id === focusedPuzzleId}
                                                title={title}
                                                index={index}
                                                id={id}
                                                onTemplateChange={onTemplateChange}
                                            />
                                        ),
                                        [EPuzzleType.TEXT_ANSWER]: (index, id) => (
                                            <InputAnswerPuzzle index={index} id={id} />
                                        ),
                                    }}
                                    onFocus={onPuzzleFocus}
                                    onMouseDown={(event, id) => onPuzzleMouseDown(event, id)}
                                    onBlur={onPuzzleBlur}
                                    isFocused={id => id === focusedPuzzleId}
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
