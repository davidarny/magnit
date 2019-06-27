/** @jsx jsx */

import { jsx } from "@emotion/core";
import * as React from "react";
import { useEffect, useState } from "react";
import { ETerminals, IPuzzle, ITemplate } from "./entities";
import { Grid, TextField } from "@material-ui/core";
import { SectionPuzzle } from "./items/section-puzzle";
import { EPuzzleType, PuzzleToolbar } from "./components/puzzle";
import uuid from "uuid/v4";
import { traverse } from "./services/json";
import _ from "lodash";
import { Block } from "./components/block";
import { Content } from "./components/content";

interface ITemplateEditorProps {
    initialState?: ITemplate;
}

export interface IEditorContext {
    template: ITemplate;

    onTemplateChange(template: ITemplate): void;

    onAddAnswerPuzzle(id: string): void;

    onDeleteAnswerPuzzle(id: string): void;
}

export const EditorContext = React.createContext<IEditorContext>(_.stubObject());

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

    return (
        <EditorContext.Provider
            value={{
                template,
                onTemplateChange,
                onAddAnswerPuzzle,
                onDeleteAnswerPuzzle,
            }}
        >
            <PuzzleToolbar
                top={toolbarTopPosition}
                onAddClick={onToolbarAddQuestion}
                onAddGroup={onToolbarAddGroup}
                onAddSection={onToolbarAddSection}
            />
            <Block
                id={template.id}
                styles={theme => ({
                    paddingTop: theme.spacing(2),
                    paddingBottom: template.puzzles.some(
                        puzzle => puzzle.puzzleType === EPuzzleType.GROUP
                    )
                        ? theme.spacing(0)
                        : theme.spacing(2),
                })}
                focused={focusedPuzzleId === template.id}
                onFocus={onPuzzleFocus.bind(undefined, template.id)}
                onMouseDown={onPuzzleFocus.bind(undefined, template.id)}
                onBlur={onPuzzleBlur}
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
                        style={{
                            paddingBottom: 10,
                        }}
                    >
                        <TextField
                            fullWidth
                            label="Описание шаблона (необязательно)"
                            defaultValue={template.description}
                        />
                    </Grid>
                    <Grid item>
                        <Content
                            puzzles={template.puzzles}
                            onFocus={onPuzzleFocus}
                            onBlur={onPuzzleBlur}
                            isFocused={id => id === focusedPuzzleId}
                        />
                    </Grid>
                </Grid>
            </Block>
            {template.sections.map((section, index) => {
                return (
                    <Block
                        key={section.id}
                        id={section.id}
                        styles={theme => ({
                            marginTop: theme.spacing(4),
                            marginBottom: theme.spacing(2),
                            paddingTop: theme.spacing(2),
                            paddingBottom: theme.spacing(2),
                        })}
                        onFocus={onPuzzleFocus.bind(null, section.id)}
                        onMouseDown={onPuzzleFocus.bind(null, section.id)}
                        onBlur={onPuzzleBlur}
                        focused={focusedPuzzleId === section.id}
                    >
                        <div style={{ margin: 0 }} />
                        <SectionPuzzle title={section.title} id={section.id} index={index} />
                        <Grid item>
                            <Content
                                puzzles={section.puzzles}
                                onFocus={onPuzzleFocus}
                                onBlur={onPuzzleBlur}
                                isFocused={id => id === focusedPuzzleId}
                            />
                        </Grid>
                    </Block>
                );
            })}
        </EditorContext.Provider>
    );
};
