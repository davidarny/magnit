/** @jsx jsx */

import { jsx } from "@emotion/core";
import * as React from "react";
import { useEffect, useState } from "react";
import { ETerminals, IPuzzle, ITemplate } from "./entities";
import { Grid, Paper, TextField } from "@material-ui/core";
import { SectionPuzzle } from "./items/section-puzzle";
import { GroupPuzzle } from "./items/group-puzzle";
import { QuestionPuzzle } from "./items/question-puzzle";
import { EPuzzleType, Puzzle, PuzzleToolbar } from "./components/puzzle";
import { TextAnswerPuzzle } from "./items/text-answer-puzzle";
import uuid from "uuid/v4";
import { traverse } from "./services/json";
import { NumericAnswerPuzzle } from "./items/numeric-answer-puzzle";
import { RadioAnswerPuzzle } from "./items/radio-answer-puzzle";
import _ from "lodash";
import { CheckboxAnswerPuzzle } from "./items/checkbox-answer-puzzle";

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

    (window as typeof window & { template: ITemplate }).template = template;

    useEffect(() => {
        // set toolbar offset top
        if (!focusedPuzzleChain.length) {
            return;
        }
        const focusedPuzzleId = _.head(focusedPuzzleChain);
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
            const focusedPuzzleId = _.head(focusedPuzzleChain);
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
            const focusedPuzzleId = _.head(focusedPuzzleChain);
            if (value.id !== focusedPuzzleId || !focusedPuzzleChain.includes(value.id)) {
                return;
            }
            // do not allow to add group in group, question, etc...
            if ("puzzleType" in value) {
                return;
            }
            const puzzle = value as IPuzzle;
            const prevPuzzle = puzzle.puzzles[puzzle.puzzles.length - 1];
            puzzle.puzzles.push({
                id: uuid(),
                puzzles: [],
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
            puzzles: [],
            title: ETerminals.EMPTY,
            order: (prevSection || { order: -1 }).order + 1,
        });
        setTemplate({ ...template });
    }

    function onPuzzleBlur(event: React.SyntheticEvent): void {
        event.preventDefault();
        event.stopPropagation();
    }

    const wait = 100;
    const throttledChainCleaning = _.throttle(() => {
        focusedPuzzleChain.length = 0;
    }, wait);

    function onPuzzleFocus(id: string): void {
        throttledChainCleaning();
        if (focusedPuzzleChain.includes(id)) {
            setFocusedPuzzleChain([...focusedPuzzleChain]);
            return;
        }
        focusedPuzzleChain.push(id);
        setFocusedPuzzleChain([...focusedPuzzleChain]);
    }

    function onTemplateChange(template: ITemplate) {
        setTemplate({ ...template });
    }

    function onAddAnswerPuzzle(id: string): void {
        traverse(template, (value: any) => {
            if (typeof value !== "object" || !("id" in value)) {
                return;
            }
            const puzzle = value as IPuzzle;
            if (!("puzzles" in puzzle)) {
                return;
            }
            if (!puzzle.puzzles.some(child => child.id === id)) {
                return;
            }
            const lastPuzzle = _.last(puzzle.puzzles) || {
                order: -1,
                puzzleType: (ETerminals.EMPTY as unknown) as EPuzzleType,
            };
            puzzle.puzzles.push({
                id: uuid(),
                title: "",
                puzzles: [],
                puzzleType: lastPuzzle.puzzleType,
                order: lastPuzzle.order + 1,
                conditions: [],
                description: "",
                validations: [],
            });
        });
        setTemplate({ ...template });
    }

    function onDeleteAnswerPuzzle(id: string): void {
        traverse(template, (value: any) => {
            if (typeof value !== "object" || !("id" in value)) {
                return;
            }
            const puzzle = value as IPuzzle;
            if (!("puzzles" in puzzle)) {
                return;
            }
            if (!puzzle.puzzles.some(child => child.id === id)) {
                return;
            }
            // do not allow to delete puzzle if only one found
            if (puzzle.puzzles.length === 1) {
                return;
            }
            const indexOfPuzzleToDelete = puzzle.puzzles.findIndex(child => child.id === id);
            console.log("%c%s", "color:" + "#094349", "index", indexOfPuzzleToDelete);
            puzzle.puzzles.splice(indexOfPuzzleToDelete, 1);
            // re-calculate order
            puzzle.puzzles = puzzle.puzzles.map((element, index) => {
                return {
                    order: index,
                    ...element,
                };
            });
        });
        setTemplate({ ...template });
    }

    const focusedPuzzleId = _.head(focusedPuzzleChain);

    const components = {
        [EPuzzleType.GROUP]: (index: number, id: string) => (
            <GroupPuzzle
                template={template}
                isFocused={id => id === focusedPuzzleId}
                id={id}
                index={index}
                onTemplateChange={onTemplateChange}
            />
        ),
        [EPuzzleType.QUESTION]: (index: number, id: string, title: string) => (
            <QuestionPuzzle
                template={template}
                isFocused={id => id === focusedPuzzleId}
                title={title}
                index={index}
                id={id}
                onTemplateChange={onTemplateChange}
            />
        ),
        [EPuzzleType.TEXT_ANSWER]: (index: number, id: string) => (
            <TextAnswerPuzzle index={index} id={id} />
        ),
        [EPuzzleType.NUMERIC_ANSWER]: (index: number, id: string) => (
            <NumericAnswerPuzzle id={id} index={index} />
        ),
        [EPuzzleType.RADIO_ANSWER]: (
            index: number,
            id: string,
            title: string,
            addRadioButton: boolean,
            questionFocused: boolean
        ) => (
            <RadioAnswerPuzzle
                template={template}
                title={title}
                onTemplateChange={onTemplateChange}
                id={id}
                index={index}
                addRadioButton={addRadioButton}
                questionFocused={questionFocused}
                onAddRadioButton={onAddAnswerPuzzle}
                onDeleteRadioButton={onDeleteAnswerPuzzle}
            />
        ),
        [EPuzzleType.CHECKBOX_ANSWER]: (
            index: number,
            id: string,
            title: string,
            addCheckboxButton: boolean,
            questionFocused: boolean
        ) => (
            <CheckboxAnswerPuzzle
                template={template}
                title={title}
                onTemplateChange={onTemplateChange}
                id={id}
                index={index}
                addCheckboxButton={addCheckboxButton}
                questionFocused={questionFocused}
                onAddCheckboxButton={onAddAnswerPuzzle}
                onDeleteCheckboxButton={onDeleteAnswerPuzzle}
            />
        ),
    };

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
                            components={components}
                            onFocus={onPuzzleFocus}
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
                                css={theme => ({
                                    width: "100%",
                                    ":empty": {
                                        minHeight: theme.spacing(32),
                                    },
                                })}
                                elevation={focusedPuzzleId === section.id ? 16 : 0}
                            >
                                <Puzzle
                                    puzzles={section.puzzles}
                                    index={index}
                                    components={components}
                                    onFocus={onPuzzleFocus}
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
