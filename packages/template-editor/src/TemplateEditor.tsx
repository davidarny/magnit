/** @jsx jsx */

import { jsx } from "@emotion/core";
import * as React from "react";
import { useEffect, useState } from "react";
import { ETerminals, IPuzzle, ITemplate } from "./entities";
import { SectionPuzzle } from "./items/section-puzzle";
import { EPuzzleType, PuzzleToolbar } from "./components/puzzle";
import uuid from "uuid/v4";
import { traverse } from "./services/json";
import _ from "lodash";
import { SelectableBlockWrapper } from "./components/block";
import { Content, ContentSection } from "./components/content";
import { ETemplateType } from "./entities/ETemplateType";

interface ITemplateEditorProps {
    initialState?: ITemplate;
}

export interface IEditorContext {
    template: ITemplate;

    onTemplateChange(template: ITemplate): void;

    onAddAnswerPuzzle(id: string): void;

    onDeleteAnswerPuzzle(id: string): void;
}

export const EditorContext = React.createContext<IEditorContext>(({} as unknown) as IEditorContext);

export const TemplateEditor: React.FC<ITemplateEditorProps> = props => {
    const [template, setTemplate] = useState<ITemplate>(
        props.initialState || {
            id: uuid(),
            sections: [],
            title: ETerminals.EMPTY,
            description: ETerminals.EMPTY,
            type: ETemplateType.LIGHT,
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
            // do not allow to add question in template, section, question, answer, etc...
            if (
                !("puzzles" in value) ||
                ("puzzleType" in value && !whitelist.includes(value.puzzleType))
            ) {
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
        // if we are focused in template
        // adding to first section if exists
        if (template.sections.every(section => !focusedPuzzleChain.includes(section.id))) {
            const firstSection = _.head(template.sections);
            if (!firstSection) {
                return;
            }
            const prevPuzzle = firstSection.puzzles[firstSection.puzzles.length - 1];
            firstSection.puzzles.push({
                id: uuid(),
                puzzles: [],
                validations: [],
                conditions: [],
                description: ETerminals.EMPTY,
                title: ETerminals.EMPTY,
                puzzleType: EPuzzleType.GROUP,
                order: (prevPuzzle || { order: -1 }).order + 1,
            });
        }
        // else adding to section which is in focused puzzle chain
        else {
            template.sections.forEach(section => {
                if (!focusedPuzzleChain.includes(section.id)) {
                    return;
                }
                const prevPuzzle = section.puzzles[section.puzzles.length - 1];
                section.puzzles.push({
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
        }
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

    function onDeletePuzzle(): void {
        traverse(template, (value: any) => {
            if (typeof value !== "object" || !("id" in value)) {
                return;
            }
            const focusedPuzzleId = _.head(focusedPuzzleChain);
            const puzzle = value as IPuzzle | ITemplate;
            if ("puzzles" in puzzle) {
                if (puzzle.puzzles.some(child => child.id === focusedPuzzleId)) {
                    const indexOfPuzzleToDelete = puzzle.puzzles.findIndex(
                        child => child.id === focusedPuzzleId
                    );
                    puzzle.puzzles.splice(indexOfPuzzleToDelete, 1);
                    // re-calculate order
                    puzzle.puzzles = puzzle.puzzles.map((element, index) => {
                        return {
                            order: index,
                            ...element,
                        };
                    });
                }
            }
            if ("sections" in puzzle) {
                if (puzzle.sections.some(child => child.id === focusedPuzzleId)) {
                    const indexOfPuzzleToDelete = puzzle.sections.findIndex(
                        child => child.id === focusedPuzzleId
                    );
                    puzzle.sections.splice(indexOfPuzzleToDelete, 1);
                    // re-calculate order
                    puzzle.sections = puzzle.sections.map((element, index) => {
                        return {
                            order: index,
                            ...element,
                        };
                    });
                }
            }
        });
        setTemplate({ ...template });
    }

    const focusedPuzzleId = _.head(focusedPuzzleChain);

    return (
        <EditorContext.Provider
            value={
                ({
                    template,
                    onTemplateChange,
                    onAddAnswerPuzzle,
                    onDeleteAnswerPuzzle,
                } as unknown) as IEditorContext
            }
        >
            <PuzzleToolbar
                top={toolbarTopPosition}
                onAddClick={onToolbarAddQuestion}
                onAddGroup={onToolbarAddGroup}
                onAddSection={onToolbarAddSection}
                onDeletePuzzle={onDeletePuzzle}
            />
            <SelectableBlockWrapper
                id={template.id}
                css={theme => ({
                    paddingTop: theme.spacing(3),
                    marginBottom: theme.spacing(2),
                })}
                focused={focusedPuzzleId === template.id}
                onFocus={onPuzzleFocus.bind(undefined, template.id)}
                onMouseDown={onPuzzleFocus.bind(undefined, template.id)}
                onBlur={onPuzzleBlur}
            >
                <ContentSection
                    template={template}
                    focused={focusedPuzzleId === template.id}
                    onTemplateChange={onTemplateChange}
                />
            </SelectableBlockWrapper>
            {template.sections.map((section, index) => {
                const focused = focusedPuzzleId === section.id;

                return (
                    <SelectableBlockWrapper
                        key={section.id}
                        id={section.id}
                        css={theme => ({
                            marginTop: theme.spacing(4),
                            marginBottom: theme.spacing(2),
                            paddingTop: theme.spacing(2),
                        })}
                        onFocus={onPuzzleFocus.bind(null, section.id)}
                        onMouseDown={onPuzzleFocus.bind(null, section.id)}
                        onBlur={onPuzzleBlur}
                        focused={focused}
                    >
                        <SectionPuzzle
                            id={section.id}
                            title={section.title}
                            description={""}
                            index={index}
                            focused={focused}
                        >
                            <Content
                                puzzles={section.puzzles}
                                onFocus={onPuzzleFocus}
                                onBlur={onPuzzleBlur}
                                isFocused={id => id === focusedPuzzleId}
                            />
                        </SectionPuzzle>
                    </SelectableBlockWrapper>
                );
            })}
        </EditorContext.Provider>
    );
};
