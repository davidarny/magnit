/* eslint-disable react-hooks/exhaustive-deps */
/** @jsx jsx */

import { jsx } from "@emotion/core";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { ETemplateType, IPuzzle, ISection, ITemplate } from "./entities";
import uuid from "uuid/v4";
import { traverse } from "./services/json";
import _ from "lodash";
import { EditorToolbar, SelectableBlockWrapper } from "@magnit/components";
import { SectionHead } from "./components/section-head";
import { GroupIcon, QuestionIcon, SectionIcon, TrashIcon } from "@magnit/icons";
import { TemplateSection } from "./components/template-section";
import { EEditorType, EPuzzleType, ETerminals, getEditorService } from "@magnit/services";
import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary } from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";

interface ITemplateEditorProps {
    initialState?: ITemplate;

    onChange?(template: ITemplate): void;

    onAddAsset?(file: File): Promise<{ filename: string }>;

    onDeleteAsset?(filename: string): Promise<unknown>;
}

interface ICache {
    sections: Map<string, ISection>;
    puzzles: Map<string, IPuzzle>;
}

export interface IEditorContext {
    template: ITemplate;
    cache: ICache;

    onTemplateChange(template: ITemplate): void;

    onAddAnswerPuzzle(id: string, addition?: Partial<IPuzzle>): void;

    onDeleteAnswerPuzzle(id: string): void;

    onUploadAsset(file: File): Promise<{ filename: string }>;

    onDeleteAsset(filename: string): Promise<unknown>;
}

export const EditorContext = React.createContext<IEditorContext>(({} as unknown) as IEditorContext);

export const TemplateEditor: React.FC<ITemplateEditorProps> = props => {
    const cache = useRef<ICache>({
        sections: new Map<string, ISection>(),
        puzzles: new Map<string, IPuzzle>(),
    }).current;
    const [template, setTemplate] = useState<ITemplate>(
        props.initialState || {
            id: uuid(),
            sections: [],
            title: ETerminals.EMPTY,
            description: ETerminals.EMPTY,
            type: ETemplateType.LIGHT,
        },
    );
    const [toolbarTopPosition, setToolbarTopPosition] = useState(0);
    const [focusedPuzzleChain, setFocusedPuzzleChain] = useState<string[]>([template.id]);
    const service = useRef(
        getEditorService(EEditorType.TEMPLATE, [
            [focusedPuzzleChain, setFocusedPuzzleChain],
            [toolbarTopPosition, setToolbarTopPosition],
        ]),
    );

    (window as typeof window & { template: ITemplate }).template = template;

    // set toolbar offset top
    useEffect(() => {
        service.current.updateToolbarTopPosition();
    }, [focusedPuzzleChain]);

    // handle passed onChange callback
    // update cache
    useEffect(() => {
        if (props.onChange) {
            props.onChange(template);
        }
        const isSection = (object: unknown): object is ISection =>
            !_.has(object, "puzzleType") && _.has(object, "puzzles");
        const isPuzzle = (object: unknown): object is IPuzzle =>
            _.has(object, "puzzleType") && _.has(object, "puzzles");

        cache.puzzles.clear();
        cache.sections.clear();
        traverse(template, (element: IPuzzle | ISection) => {
            if (isPuzzle(element)) {
                cache.puzzles.set(element.id, element);
            }
            if (isSection(element)) {
                cache.sections.set(element.id, element);
            }
        });
    }, [template]);

    function onToolbarAddQuestion(): void {
        if (_.isEmpty(focusedPuzzleChain)) {
            return;
        }
        const focusedPuzzleId = _.first(focusedPuzzleChain);
        if (!focusedPuzzleId) {
            return;
        }
        // check if adding question to puzzle
        // probably this puzzle is GROUP
        if (cache.puzzles.has(focusedPuzzleId)) {
            const puzzle = cache.puzzles.get(focusedPuzzleId)!;
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
        } else {
            // initially adding to last section
            // if not focused to any
            let section = _.last(Array.from(cache.sections.values())) as ISection | undefined;
            if (cache.sections.has(focusedPuzzleId)) {
                section = cache.sections.get(focusedPuzzleId);
            }
            if (section) {
                if (!_.has(section, "puzzles")) {
                    section.puzzles = [];
                }
                section.puzzles!.push({
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
                    order: 0,
                });
            }
        }
        setTemplate({ ...template });
    }

    function onToolbarAddGroup(): void {
        // if we are focused in template
        // adding to first section if exists
        if (template.sections.every(section => !focusedPuzzleChain.includes(section.id))) {
            const section = _.last(template.sections);
            if (!section) {
                return;
            }
            const prevPuzzle = section.puzzles[section.puzzles.length - 1];
            const id = uuid();
            section.puzzles.push({
                id,
                puzzles: [],
                validations: [],
                conditions: [],
                description: ETerminals.EMPTY,
                title: ETerminals.EMPTY,
                puzzleType: EPuzzleType.GROUP,
                order: (prevPuzzle || { order: -1 }).order + 1,
            });
            cache.puzzles.set(id, _.last(section.puzzles)!);
        }
        // else adding to section which is in focused puzzle chain
        else {
            template.sections.forEach(section => {
                if (!focusedPuzzleChain.includes(section.id)) {
                    return;
                }
                const prevPuzzle = section.puzzles[section.puzzles.length - 1];
                const id = uuid();
                section.puzzles.push({
                    id,
                    puzzles: [],
                    validations: [],
                    conditions: [],
                    description: ETerminals.EMPTY,
                    title: ETerminals.EMPTY,
                    puzzleType: EPuzzleType.GROUP,
                    order: (prevPuzzle || { order: -1 }).order + 1,
                });
                cache.puzzles.set(id, _.last(section.puzzles)!);
            });
        }
        setTemplate({ ...template });
    }

    function onToolbarAddSection(): void {
        const prevSection = template.sections[template.sections.length - 1];
        const id = uuid();
        template.sections.push({
            id,
            puzzles: [],
            title: ETerminals.EMPTY,
            order: (prevSection || { order: -1 }).order + 1,
        });
        cache.sections.set(id, _.last(template.sections)!);
        setTemplate({ ...template });
    }

    function onAddAnswerPuzzle(id: string, addition: Partial<IPuzzle> = {}): void {
        traverse(template, (puzzle: IPuzzle) => {
            if (!_.has(puzzle, "id")) {
                return;
            }
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
            _.assign(lastPuzzle, addition);
            puzzle.puzzles.push({
                id: uuid(),
                title: ETerminals.EMPTY,
                puzzles: [],
                puzzleType: lastPuzzle.puzzleType,
                order: lastPuzzle.order + 1,
                conditions: [],
                description: ETerminals.EMPTY,
                validations: [],
            });
            return true;
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
            return true;
        });
        setTemplate({ ...template });
    }

    function onDeletePuzzle(): void {
        traverse(template, (puzzle: IPuzzle | ITemplate) => {
            if (!_.has(puzzle, "id")) {
                return;
            }
            const focusedPuzzleId = _.head(focusedPuzzleChain);
            if ("puzzles" in puzzle) {
                if (puzzle.puzzles.some(child => child.id === focusedPuzzleId)) {
                    const indexOfPuzzleToDelete = puzzle.puzzles.findIndex(
                        child => child.id === focusedPuzzleId,
                    );
                    puzzle.puzzles.splice(indexOfPuzzleToDelete, 1);
                    // re-calculate order
                    puzzle.puzzles = puzzle.puzzles.map((element, index) => {
                        return {
                            order: index,
                            ...element,
                        };
                    });
                    // update focused puzzle chain
                    focusedPuzzleChain.splice(0, 1);
                    const puzzleToFocusOn = _.nth(puzzle.puzzles, indexOfPuzzleToDelete);
                    if (puzzleToFocusOn) {
                        focusedPuzzleChain.unshift(puzzleToFocusOn.id);
                        setFocusedPuzzleChain([...focusedPuzzleChain]);
                    }
                    return true;
                }
            }
            if ("sections" in puzzle) {
                if (puzzle.sections.some(child => child.id === focusedPuzzleId)) {
                    const indexOfPuzzleToDelete = puzzle.sections.findIndex(
                        child => child.id === focusedPuzzleId,
                    );
                    puzzle.sections.splice(indexOfPuzzleToDelete, 1);
                    // re-calculate order
                    puzzle.sections = puzzle.sections.map((element, index) => {
                        return {
                            order: index,
                            ...element,
                        };
                    });
                    // update focused puzzle chain
                    focusedPuzzleChain.splice(0, 1);
                    const puzzleToFocusOn = _.nth(puzzle.sections, indexOfPuzzleToDelete);
                    if (puzzleToFocusOn) {
                        focusedPuzzleChain.unshift(puzzleToFocusOn.id);
                        setFocusedPuzzleChain([...focusedPuzzleChain]);
                    }
                    return true;
                }
            }
        });
        setTemplate({ ...template });
    }

    function onTemplateChange(template: ITemplate) {
        setTemplate({ ...template });
    }

    const focusedPuzzleId = _.first(focusedPuzzleChain);

    return (
        <EditorContext.Provider
            value={
                ({
                    template,
                    cache,
                    onTemplateChange,
                    onAddAnswerPuzzle,
                    onDeleteAnswerPuzzle,
                    onUploadAsset: props.onAddAsset,
                    onDeleteAsset: props.onDeleteAsset,
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
                    {
                        label: "Добавить группу",
                        icon: <GroupIcon />,
                        action: onToolbarAddGroup,
                    },
                    {
                        label: "Добавить раздел",
                        icon: <SectionIcon />,
                        action: onToolbarAddSection,
                    },
                    {
                        label: "Удалить элемент",
                        icon: <TrashIcon />,
                        action: onDeletePuzzle,
                    },
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
                        key={section.id}
                        section={section}
                        index={index}
                        template={template}
                        focusedPuzzleId={focusedPuzzleId}
                        onTemplateChange={onTemplateChange}
                        onPuzzleFocus={service.current.onPuzzleFocus.bind(service.current)}
                        onPuzzleBlur={service.current.onPuzzleBlur.bind(service.current)}
                    />
                ))}
            {process.env.NODE_ENV !== "production" && (
                <ExpansionPanel css={theme => ({ marginTop: theme.spacing(3) })}>
                    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                        JSON
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <pre>{JSON.stringify(template, null, 2)}</pre>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
            )}
        </EditorContext.Provider>
    );
};
