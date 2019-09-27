import { EPuzzleType, ICondition, IPuzzle, ISection, IValidation } from "@magnit/entities";
import _ from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";

export interface IUseConditionsService<T> {
    setConditions(conditions: T[]): void;

    getConditions(): T[];

    getRightPuzzle(condition: T): string;

    resetConditions(condition: T): void;

    checkDependentQuestionChanged(leftQuestion: IPuzzle, rightQuestion: IPuzzle): boolean;

    filterConditions(virtualCondition: T | null): T[];

    onConditionsChange(virtualCondition: T | null): void;

    shouldSetQuestions(puzzle: IPuzzle): boolean;

    getVirtualCondition(): T;

    conditionsEmpty(): boolean;
}

export function useCommonConditionsLogic<T extends ICondition | IValidation>(
    puzzle: IPuzzle,
    puzzles: Map<string, IPuzzle>,
    parent: IPuzzle | ISection,
    service: IUseConditionsService<T>,
    onTemplateChange: () => void,
): [
    IPuzzle[],
    IPuzzle[],
    T | null,
    (value: T | null) => void,
    (id: string) => void,
    (id: string, update: T) => void,
    (onAddConditionImpl: (last: T) => Partial<T>) => void,
] {
    const [virtualCondition, setVirtualCondition] = useState<T | null>(
        service.conditionsEmpty() ? service.getVirtualCondition() : null,
    );
    const [questions, setQuestions] = useState<IPuzzle[]>([]);
    const [answers, setAnswers] = useState<IPuzzle[]>([]);

    const prevVirtualCondition = useRef(_.cloneDeep(virtualCondition));
    const prevPuzzlePuzzles = useRef(_.cloneDeep(puzzle.puzzles));
    useEffect(() => {
        // exit when ...
        const virtualConditionSame = _.isEqual(prevVirtualCondition.current, virtualCondition);
        const puzzleChildrenSame = _.isEqual(prevPuzzlePuzzles.current, puzzle.puzzles);
        const anyConditionsNotEmpty = !service.conditionsEmpty() && !_.isNil(virtualCondition);
        if (
            // ... either virtual condition hasn't changed whereas puzzle content changed ...
            (!virtualConditionSame && puzzleChildrenSame) ||
            // ... or there are any conditions in some store
            anyConditionsNotEmpty
        ) {
            prevVirtualCondition.current = _.cloneDeep(virtualCondition);
            return;
        }
        prevVirtualCondition.current = _.cloneDeep(virtualCondition);
        const puzzleChildrenEmpty =
            !_.isEmpty(prevPuzzlePuzzles.current) && !_.isEmpty(puzzle.puzzles);
        // enter when puzzle children are different or empty
        if (!puzzleChildrenSame || puzzleChildrenEmpty) {
            prevPuzzlePuzzles.current = _.cloneDeep(puzzle.puzzles);
            if (!service.conditionsEmpty()) {
                setVirtualCondition(null);
            } else {
                setVirtualCondition(service.getVirtualCondition());
            }
        }
    }, [puzzle.puzzles, service, virtualCondition]);

    const { puzzles: parentPuzzles } = parent || { puzzles: [] };
    const prevQuestions = useRef(_.cloneDeep(questions));
    const prevAnswers = useRef(_.cloneDeep(answers));
    useEffect(() => {
        // fill questions and answers initially
        // by traversing whole template tree
        questions.length = 0;
        answers.length = 0;
        // find index of current puzzle in a tree
        const index = parentPuzzles.findIndex(item => item.id === puzzle.id);
        if (index === -1) {
            return;
        }
        _.range(0, index).forEach(i => {
            const childPuzzle = parentPuzzles[i];
            if (
                childPuzzle.puzzleType === EPuzzleType.QUESTION &&
                service.shouldSetQuestions(childPuzzle) &&
                !_.isEmpty(childPuzzle.title.toString())
            ) {
                questions.push(childPuzzle);
                childPuzzle.puzzles.forEach(childOfChildPuzzle => {
                    // if puzzle is one of answers types
                    // then it's allowed to be selected as an answerPuzzle
                    const excludedPuzzleTypes = [EPuzzleType.GROUP, EPuzzleType.QUESTION];
                    // enter if puzzle is not GROUP or QUESTION
                    if (!excludedPuzzleTypes.includes(childOfChildPuzzle.puzzleType)) {
                        answers.push(childOfChildPuzzle);
                    }
                });
            }
        });
        if (!_.isEqual(prevQuestions.current, questions)) {
            const clonedQuestions = _.cloneDeep(questions);
            prevQuestions.current = clonedQuestions;
            setQuestions(clonedQuestions);
        }
        if (!_.isEqual(prevAnswers.current, answers)) {
            const clonedAnswers = _.cloneDeep(answers);
            prevAnswers.current = clonedAnswers;
            setAnswers(clonedAnswers);
        }
    }, [answers, parentPuzzles, puzzle.id, questions, service]);

    // hook for invalidating conditions if
    // dependent question has changed
    const prevDependents = useRef(_.cloneDeep(questions));
    useEffect(() => {
        if (service.conditionsEmpty()) {
            return;
        }
        let changed = false;
        service.getConditions().forEach(condition => {
            const dependent = prevDependents.current.find(
                question => question.id === service.getRightPuzzle(condition),
            );
            if (!dependent) {
                return;
            }
            for (const pair of puzzles) {
                if (changed) {
                    break;
                }
                const puzzle = pair[1];
                // find dependent question in template
                if (puzzle.puzzleType !== EPuzzleType.QUESTION || puzzle.id !== dependent.id) {
                    continue;
                }
                // check if dependent question has changed
                changed = service.checkDependentQuestionChanged(dependent, puzzle);
            }
        });
        prevDependents.current = _.cloneDeep(questions);
        if (!changed) {
            return;
        }
        const first = _.first(service.getConditions())!;
        service.resetConditions(first);
        setVirtualCondition(first);
        service.setConditions([]);
        onTemplateChange();
    }, [onTemplateChange, puzzles, questions, service]);

    const onConditionDeleteCallback = useCallback(
        (id: string) => {
            if (virtualCondition && virtualCondition.id === id) {
                if (!service.conditionsEmpty()) {
                    setVirtualCondition(null);
                } else {
                    setVirtualCondition(service.getVirtualCondition());
                }
            } else {
                const isCurrentCondition = (condition: T) => condition.id !== id;
                const nextConditions = [...service.getConditions().filter(isCurrentCondition)];
                service.setConditions(nextConditions);
                if (service.conditionsEmpty()) {
                    setVirtualCondition(service.getVirtualCondition());
                }
                onTemplateChange();
            }
        },
        [onTemplateChange, service, virtualCondition],
    );

    const tryToCommitCondition = useCallback(
        (nextVirtualCondition?: T | null) => {
            if (!nextVirtualCondition) {
                nextVirtualCondition = null;
            }
            service.onConditionsChange(nextVirtualCondition);
            const containsVirtualCondition = (condition: T) =>
                nextVirtualCondition && condition.id === nextVirtualCondition.id;
            const virtualConditionInserted = service.getConditions().some(containsVirtualCondition);
            if (virtualConditionInserted) {
                setVirtualCondition(null);
            }
            // handle case when both conditions & virtual condition are empty
            const allConditionsEmpty = service.conditionsEmpty() && _.isNil(nextVirtualCondition);
            if (allConditionsEmpty) {
                setVirtualCondition(service.getVirtualCondition());
            }
        },
        [service],
    );

    const onConditionChangeCallback = useCallback(
        (id: string, update: T): void => {
            let nextVirtualCondition: T | null = null;
            if (virtualCondition && virtualCondition.id === id) {
                nextVirtualCondition = { ...virtualCondition, ...update };
                setVirtualCondition(nextVirtualCondition);
            } else {
                const isCurrentCondition = (condition: T) => condition.id === id;
                const changedConditionIdx = service.getConditions().findIndex(isCurrentCondition);
                service.getConditions()[changedConditionIdx] = {
                    ...service.getConditions()[changedConditionIdx],
                    ...update,
                };
                service.setConditions([...service.getConditions()]);
            }
            tryToCommitCondition(nextVirtualCondition);
        },
        [tryToCommitCondition, service, virtualCondition],
    );

    const onAddConditionCallback = useCallback(
        (onAddConditionImpl: (last: T) => Partial<T>): void => {
            service.onConditionsChange(virtualCondition);
            const last = _.last(service.getConditions());
            const containsVirtualCondition = (condition: T) =>
                virtualCondition && condition.id === virtualCondition.id;
            const virtualConditionInserted = service.getConditions().some(containsVirtualCondition);
            // enter when there is any condition in puzzle
            // and either virtual condition inserted or it's null
            if (last && (virtualConditionInserted || _.isNil(virtualCondition))) {
                setVirtualCondition({
                    ...service.getVirtualCondition(),
                    ...onAddConditionImpl(last),
                });
            }
        },
        [service, virtualCondition],
    );

    return [
        questions,
        answers,
        virtualCondition,
        setVirtualCondition,
        onConditionDeleteCallback,
        onConditionChangeCallback,
        onAddConditionCallback,
    ];
}
