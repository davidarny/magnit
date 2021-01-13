import { EPuzzleType, IPuzzle, ISection, ITemplate } from "@magnit/entities";
import { EEditorType, getEditorService, IEditorService } from "@magnit/services";
import { ICache } from "context";
import _ from "lodash";
import { MutableRefObject, useCallback, useEffect, useRef, useState } from "react";
import { traverse } from "services/json";
import uuid from "uuid/v4";

export function useTemplate(
    template: ITemplate,
    onTemplateChange?: (template: ITemplate) => void,
): [
    MutableRefObject<ICache>,
    MutableRefObject<IEditorService>,
    number,
    string[],
    () => void,
    () => void,
    () => void,
    (id: string, addition: Partial<IPuzzle>) => void,
    (id: string) => void,
    () => void,
    () => void,
] {
    const [toolbarTopPosition, setToolbarTopPosition] = useState(0);
    const [focusedPuzzleChain, setFocusedPuzzleChain] = useState<string[]>([]);

    const service = useRef(
        getEditorService(EEditorType.TEMPLATE, [
            [focusedPuzzleChain, setFocusedPuzzleChain],
            [toolbarTopPosition, setToolbarTopPosition],
        ]),
    );

    const cache = useRef<ICache>({ sections: new Map(), puzzles: new Map() });

    // set toolbar offset top
    const prevFocusedPuzzleChain = useRef(_.cloneDeep(focusedPuzzleChain));
    useEffect(() => {
        if (!_.isEqual(prevFocusedPuzzleChain.current, focusedPuzzleChain)) {
            service.current.updateToolbarTopPosition();
            prevFocusedPuzzleChain.current = _.cloneDeep(focusedPuzzleChain);
        }
    }, [focusedPuzzleChain, service]);

    // update cache
    const prevTemplate = useRef(_.cloneDeep(template));
    const prevCache = useRef(_.cloneDeep(cache));
    useEffect(() => {
        if (!_.isEqual(prevTemplate.current, template) || !_.isEqual(prevCache.current, cache)) {
            const isSection = (object: unknown): object is ISection =>
                !_.has(object, "puzzleType") && _.has(object, "puzzles");
            const isPuzzle = (object: unknown): object is IPuzzle =>
                _.has(object, "puzzleType") && _.has(object, "puzzles");

            cache.current.puzzles.clear();
            cache.current.sections.clear();

            traverse(template, (element: IPuzzle | ISection) => {
                if (isSection(element)) {
                    cache.current.sections.set(element.id, element);
                }
                if (isPuzzle(element)) {
                    cache.current.puzzles.set(element.id, element);
                }
            });

            prevTemplate.current = _.cloneDeep(template);
            prevCache.current = _.cloneDeep(cache);
        }
    }, [template]);

    const initialFocusThreshold = useRef(0);
    const initialFocusSet = useRef(false);
    useEffect(() => {
        // view updates it's focus util task is not loaded
        // so if task is never loaded, we stop at some point or it becomes painful
        // TODO: pass some bool prop so to know when set focus
        if (initialFocusThreshold.current > 75) {
            return;
        }
        if (!initialFocusSet.current) {
            initialFocusThreshold.current++;
            service.current.onPuzzleFocus(template.id.toString(), true);
        }
        if (template.id !== 0) {
            initialFocusSet.current = true;
        }
    }, [template.id]);

    const onToolbarAddQuestion = useCallback((): void => {
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
        if (cache.current.puzzles.has(focusedPuzzleId)) {
            let puzzle: IPuzzle | ISection = cache.current.puzzles.get(focusedPuzzleId)!;
            // then trying to find in which section to add
            if (hasPuzzleType(puzzle) && !whitelist.includes(puzzle.puzzleType)) {
                const puzzles = [...cache.current.sections.values()];
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
            let section = _.last([...cache.current.sections.values()]) as ISection | undefined;
            if (cache.current.sections.has(focusedPuzzleId)) {
                section = cache.current.sections.get(focusedPuzzleId);
            }
            if (section) {
                if (!_.has(section, "puzzles")) {
                    section.puzzles = [];
                }
                section.puzzles!.push({ ...puzzleToInsert, order: 0 });
            }
        }
        service.current.onPuzzleFocus(id);
        if (onTemplateChange) {
            onTemplateChange({ ...template });
        }
    }, [focusedPuzzleChain, onTemplateChange, template]);

    const onToolbarAddGroup = useCallback((): void => {
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
            cache.current.puzzles.set(id, _.last(section.puzzles)!);
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
                cache.current.puzzles.set(id, _.last(section.puzzles)!);
            });
        }
        service.current.onPuzzleFocus(id);
        if (onTemplateChange) {
            onTemplateChange({ ...template });
        }
    }, [focusedPuzzleChain, onTemplateChange, service, template]);

    const onToolbarAddSection = useCallback((): void => {
        const prevSection = template.sections[template.sections.length - 1];
        const id = uuid();
        template.sections.push({
            id,
            puzzles: [],
            title: "",
            description: "",
            order: (prevSection || { order: -1 }).order + 1,
        });
        cache.current.sections.set(id, _.last(template.sections)!);
        service.current.onPuzzleFocus(id);
        if (onTemplateChange) {
            onTemplateChange({ ...template });
        }
    }, [onTemplateChange, template]);

    const onAddAnswerPuzzle = useCallback(
        (id: string, addition: Partial<IPuzzle> = {}): void => {
            traverse(template, (puzzle: IPuzzle) => {
                if (!_.has(puzzle, "id") || !_.has(puzzle, "puzzles")) {
                    return;
                }
                if (addition.puzzleType === EPuzzleType.REFERENCE_ASSET) {
                    if (puzzle.id !== id) {
                        return;
                    }
                    const child = _.cloneDeep(_.first(puzzle.puzzles));
                    if (!child) {
                        return true;
                    }
                    if (child.puzzleType === EPuzzleType.REFERENCE_TEXT) {
                        child.puzzleType = EPuzzleType.REFERENCE_ASSET;
                    }
                    // insert puzzle
                    puzzle.puzzles.push({
                        id: uuid(),
                        title: "",
                        puzzles: [],
                        puzzleType: child.puzzleType,
                        order: child.order + 1,
                        conditions: [],
                        description: "",
                        validations: [],
                        ...addition,
                    });
                    return true;
                } else if (puzzle.puzzles.some(child => child.id === id)) {
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
                }
            });
            if (onTemplateChange) {
                onTemplateChange({ ...template });
            }
        },
        [onTemplateChange, template],
    );

    const onDeleteAnswerPuzzle = useCallback(
        (id: string): void => {
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
                        ...element,
                        order: index,
                    };
                });
                return true;
            });
            if (onTemplateChange) {
                onTemplateChange({ ...template });
            }
        },
        [onTemplateChange, template],
    );

    const onDeletePuzzle = useCallback((): void => {
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
                            ...element,
                            order: index,
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
                            ...element,
                            order: index,
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
        if (onTemplateChange) {
            onTemplateChange({ ...template });
        }
    }, [focusedPuzzleChain, onTemplateChange, template]);

    const onTemplateChangeCallback = useCallback(() => {
        if (onTemplateChange) {
            onTemplateChange({ ...template });
        }
    }, [onTemplateChange, template]);

    return [
        cache,
        service,
        toolbarTopPosition,
        focusedPuzzleChain,
        onToolbarAddQuestion,
        onToolbarAddGroup,
        onToolbarAddSection,
        onAddAnswerPuzzle,
        onDeleteAnswerPuzzle,
        onDeletePuzzle,
        onTemplateChangeCallback,
    ];
}
