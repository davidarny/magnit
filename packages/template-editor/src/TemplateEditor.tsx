/** @jsx jsx */

import { jsx } from "@emotion/core";
import { EditorToolbar, SelectableBlockWrapper } from "@magnit/components";
import { EPuzzleType, ETemplateType, IPuzzle, ISection, ITemplate } from "@magnit/entities";
import { GroupIcon, QuestionIcon, SectionIcon, TrashIcon } from "@magnit/icons";
import { EEditorType, getEditorService } from "@magnit/services";
import { ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary } from "@material-ui/core";
import { ExpandMore as ExpandMoreIcon } from "@material-ui/icons";
import _ from "lodash";
import * as React from "react";
import { useContext, useEffect, useRef, useState } from "react";
import uuid from "uuid/v4";
import { SectionHead } from "./components/section-head";
import { SectionWrapper } from "./components/section-wrapper";
import { EditorContext, ICache } from "./context";
import { traverse } from "./services/json";

interface ITemplateEditorProps {
    template?: ITemplate;

    onChange?(template: ITemplate): void;

    onAddAsset?(file: File): Promise<{ filename: string }>;

    onDeleteAsset?(filename: string): Promise<unknown>;
}

export const TemplateEditor: React.FC<ITemplateEditorProps> = props => {
    const { template: initialState } = props;

    const context = useContext(EditorContext);
    const cache = useRef<ICache>({
        sections: new Map<string, ISection>(),
        puzzles: new Map<string, IPuzzle>(),
    }).current;

    const defaultState = {
        id: 0,
        sections: [],
        title: "",
        description: "",
        type: ETemplateType.LIGHT,
    };
    const [template, setTemplate] = useState<ITemplate>(initialState || defaultState);

    const [toolbarTopPosition, setToolbarTopPosition] = useState(0);
    const [focusedPuzzleChain, setFocusedPuzzleChain] = useState<string[]>([]);

    const service = useRef(
        getEditorService(EEditorType.TEMPLATE, [
            [focusedPuzzleChain, setFocusedPuzzleChain],
            [toolbarTopPosition, setToolbarTopPosition],
        ]),
    );

    // set toolbar offset top
    useEffect(() => {
        service.current.updateToolbarTopPosition();
    }, [focusedPuzzleChain]);

    // handle initial focus
    useEffect(() => {
        const idToFocusOn = initialState ? initialState.id : defaultState.id;
        if (!focusedPuzzleChain.length) {
            service.current.onPuzzleFocus(idToFocusOn.toString());
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialState, focusedPuzzleChain]);

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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [template]);

    function onToolbarAddQuestion(): void {
        const id = uuid();
        const puzzleToInsert = {
            id,
            puzzles: [
                {
                    id: uuid(),
                    puzzleType: EPuzzleType.TEXT_ANSWER,
                    title: "",
                    description: "",
                    order: 0,
                    puzzles: [],
                    conditions: [],
                    validations: [],
                },
            ],
            validations: [],
            conditions: [],
            title: "",
            description: "",
            puzzleType: EPuzzleType.QUESTION,
        };
        // type guards
        const hasPuzzleType = (object: unknown): object is { puzzleType: EPuzzleType } =>
            _.has(object, "puzzleType");
        // whitelist of puzzle which can have questions inside
        // except TEMPLATE & SECTION as they are handled differently
        const whitelist = [EPuzzleType.GROUP];
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
            let puzzle: IPuzzle | ISection = cache.puzzles.get(focusedPuzzleId)!;
            // if adding to to a group
            // then trying to find in which section to add
            if (hasPuzzleType(puzzle) && !whitelist.includes(puzzle.puzzleType)) {
                const puzzles = [...cache.sections.values()];
                const parent = puzzles
                    .flatMap(el => [el, ...el.puzzles])
                    .find(el => el.puzzles.some(child => child.id === puzzle.id));
                if (parent) {
                    puzzle = parent;
                } else {
                    return;
                }
            }
            const prevPuzzle = puzzle.puzzles[puzzle.puzzles.length - 1];
            puzzle.puzzles.push({
                ...puzzleToInsert,
                order: (prevPuzzle || { order: -1 }).order + 1,
            });
        } else {
            // initially adding to last section
            // if not focused to any
            let section = _.last([...cache.sections.values()]) as ISection | undefined;
            if (cache.sections.has(focusedPuzzleId)) {
                section = cache.sections.get(focusedPuzzleId);
            }
            if (section) {
                if (!_.has(section, "puzzles")) {
                    section.puzzles = [];
                }
                section.puzzles!.push({ ...puzzleToInsert, order: 0 });
            }
        }
        service.current.onPuzzleFocus(id);
        setTemplate({ ...template });
    }

    function onToolbarAddGroup(): void {
        const id = uuid();
        // if we are focused in template
        // adding to first section if exists
        if (template.sections.every(section => !focusedPuzzleChain.includes(section.id))) {
            const section = _.last(template.sections);
            if (!section) {
                return;
            }
            const prevPuzzle = section.puzzles[section.puzzles.length - 1];
            section.puzzles.push({
                id,
                puzzles: [],
                validations: [],
                conditions: [],
                description: "",
                title: "",
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
                section.puzzles.push({
                    id,
                    puzzles: [],
                    validations: [],
                    conditions: [],
                    description: "",
                    title: "",
                    puzzleType: EPuzzleType.GROUP,
                    order: (prevPuzzle || { order: -1 }).order + 1,
                });
                cache.puzzles.set(id, _.last(section.puzzles)!);
            });
        }
        service.current.onPuzzleFocus(id);
        setTemplate({ ...template });
    }

    function onToolbarAddSection(): void {
        const prevSection = template.sections[template.sections.length - 1];
        const id = uuid();
        template.sections.push({
            id,
            puzzles: [],
            title: "",
            description: "",
            order: (prevSection || { order: -1 }).order + 1,
        });
        cache.sections.set(id, _.last(template.sections)!);
        service.current.onPuzzleFocus(id);
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
            const prevPuzzle = _.last(puzzle.puzzles) || {
                order: -1,
                puzzleType: "" as EPuzzleType,
            };
            // update last puzzle with payload
            _.assign(prevPuzzle, addition);
            // insert stub puzzle
            puzzle.puzzles.push({
                id: uuid(),
                title: "",
                puzzles: [],
                puzzleType: prevPuzzle.puzzleType,
                order: prevPuzzle.order + 1,
                conditions: [],
                description: "",
                validations: [],
            });
            return true;
        });
        setTemplate({ ...template });
    }

    function onDeleteAnswerPuzzle(id: string): void {
        traverse(template, (puzzle: IPuzzle) => {
            if (
                !_.has(puzzle, "id") ||
                !_.has(puzzle, "puzzles") ||
                !puzzle.puzzles.some(child => child.id === id) ||
                // do not allow to delete puzzle if only one found
                puzzle.puzzles.length === 1
            ) {
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
                    const puzzleToFocusOn = _.nth(
                        puzzle.puzzles,
                        Math.max(indexOfPuzzleToDelete - 1, 0),
                    );
                    if (puzzleToFocusOn) {
                        focusedPuzzleChain.unshift(puzzleToFocusOn.id);
                        service.current.onPuzzleFocus(puzzleToFocusOn.id);
                    } else {
                        service.current.onPuzzleFocus(_.first(template.sections)!.id);
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
                    const puzzleToFocusOn = _.nth(
                        puzzle.sections,
                        Math.max(indexOfPuzzleToDelete - 1, 0),
                    );
                    if (puzzleToFocusOn) {
                        focusedPuzzleChain.unshift(puzzleToFocusOn.id);
                        service.current.onPuzzleFocus(puzzleToFocusOn.id);
                    } else {
                        service.current.onPuzzleFocus(template.id.toString());
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
    const focusedOnTemplateHead = focusedPuzzleId === template.id.toString();

    context.template = template;
    context.cache = cache;
    context.onDeleteAsset = props.onDeleteAsset || context.onDeleteAsset;
    context.onUploadAsset = props.onAddAsset || context.onUploadAsset;
    context.onTemplateChange = onTemplateChange;
    context.onAddAnswerPuzzle = onAddAnswerPuzzle;
    context.onDeleteAnswerPuzzle = onDeleteAnswerPuzzle;

    const editorToolbarItems = [
        ...(focusedOnTemplateHead
            ? []
            : [
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
              ]),
        {
            label: "Добавить раздел",
            icon: <SectionIcon />,
            action: onToolbarAddSection,
        },
        ...(focusedOnTemplateHead
            ? []
            : [
                  {
                      label: "Удалить элемент",
                      icon: <TrashIcon css={theme => ({ color: theme.colors.gray })} />,
                      action: onDeletePuzzle,
                  },
              ]),
    ];

    return (
        <React.Fragment>
            <EditorToolbar top={toolbarTopPosition} items={editorToolbarItems} />
            <SelectableBlockWrapper
                id={template.id.toString()}
                css={theme => ({
                    paddingTop: theme.spacing(3),
                    marginBottom: theme.spacing(2),
                })}
                focused={focusedPuzzleId === template.id.toString()}
                onFocus={service.current.onPuzzleFocus.bind(service, template.id.toString(), false)}
                onMouseDown={service.current.onPuzzleFocus.bind(
                    service,
                    template.id.toString(),
                    false,
                )}
            >
                <SectionHead
                    template={template}
                    focused={focusedPuzzleId === template.id.toString()}
                    onTemplateChange={onTemplateChange}
                />
            </SelectableBlockWrapper>
            {(template.sections || []).map((section, index) => (
                <SectionWrapper
                    key={section.id}
                    section={section}
                    index={index}
                    template={template}
                    focusedPuzzleId={focusedPuzzleId}
                    onTemplateChange={onTemplateChange}
                    onPuzzleFocus={service.current.onPuzzleFocus.bind(service)}
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
        </React.Fragment>
    );
};
