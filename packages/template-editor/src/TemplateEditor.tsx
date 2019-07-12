/* eslint-disable react-hooks/exhaustive-deps */
/** @jsx jsx */

import { jsx } from "@emotion/core";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { ETemplateType, IPuzzle, ITemplate } from "./entities";
import { EPuzzleType } from "./components/puzzle";
import uuid from "uuid/v4";
import { traverse } from "./services/json";
import _ from "lodash";
import { SelectableBlockWrapper, EditorToolbar } from "@magnit/components";
import { SectionHead } from "./components/section-head";
import { GroupIcon, QuestionIcon, SectionIcon, TrashIcon } from "@magnit/icons";
import { TemplateSection } from "./components/template-section";
import { EEditorType, getEditorService } from "@magnit/services";
import { ETerminals } from "@magnit/services";

interface ITemplateEditorProps {
    initialState?: ITemplate;

    onChange?(template: ITemplate): void;
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
    const service = useRef(
        getEditorService(EEditorType.TEMPLATE, [[focusedPuzzleChain, setFocusedPuzzleChain]])
    );

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
    }, [focusedPuzzleChain]);

    useEffect(() => {
        if (props.onChange) {
            props.onChange(template);
        }
    }, [template]);

    function onToolbarAddQuestion(): void {
        const whitelist = [EPuzzleType.GROUP];
        traverse(template, (value: any) => {
            if (_.isEmpty(focusedPuzzleChain) || !_.has(value, "id")) {
                return;
            }
            const focusedPuzzleId = _.head(focusedPuzzleChain);
            if (value.id !== focusedPuzzleId || !focusedPuzzleChain.includes(value.id)) {
                return;
            }
            // do not allow to add question in template, section, question, answer, etc...
            if (
                !_.has(value, "puzzles") ||
                (_.has(value, "puzzleType") && !whitelist.includes(value.puzzleType))
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

    function onTemplateChange(template: ITemplate) {
        setTemplate({ ...template });
    }

    function onAddAnswerPuzzle(id: string): void {
        traverse(template, (value: any) => {
            if (!_.has(value, "id")) {
                return;
            }
            const puzzle = value as IPuzzle;
            if (!_.has(puzzle, "puzzles")) {
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
            if (!_.has(value, "id")) {
                return;
            }
            const puzzle = value as IPuzzle;
            if (!_.has(puzzle, "puzzles")) {
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
            if (!_.has(value, "id")) {
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
            <EditorToolbar
                top={toolbarTopPosition}
                items={[
                    {
                        label: "Добавить вопрос",
                        icon: <QuestionIcon />,
                        action: onToolbarAddQuestion,
                    },
                    { label: "Добавить группу", icon: <GroupIcon />, action: onToolbarAddGroup },
                    {
                        label: "Добавить раздел",
                        icon: <SectionIcon />,
                        action: onToolbarAddSection,
                    },
                    { label: "Удалить элемент", icon: <TrashIcon />, action: onDeletePuzzle },
                ]}
            />
            <SelectableBlockWrapper
                id={template.id}
                css={theme => ({
                    paddingTop: theme.spacing(3),
                    marginBottom: theme.spacing(2),
                })}
                focused={focusedPuzzleId === template.id}
                onFocus={service.current.onPuzzleFocus.bind(service.current, template.id)}
                onMouseDown={service.current.onPuzzleFocus.bind(service.current, template.id)}
                onBlur={service.current.onPuzzleBlur.bind(service.current)}
            >
                <SectionHead
                    template={template}
                    focused={focusedPuzzleId === template.id}
                    onTemplateChange={onTemplateChange}
                />
            </SelectableBlockWrapper>
            {template.sections &&
                template.sections.map((section, index) => (
                    <TemplateSection
                        section={section}
                        index={index}
                        template={template}
                        focusedPuzzleId={focusedPuzzleId}
                        onTemplateChange={onTemplateChange}
                        onPuzzleFocus={service.current.onPuzzleFocus.bind(service.current)}
                        onPuzzleBlur={service.current.onPuzzleBlur.bind(service.current)}
                    />
                ))}
        </EditorContext.Provider>
    );
};
