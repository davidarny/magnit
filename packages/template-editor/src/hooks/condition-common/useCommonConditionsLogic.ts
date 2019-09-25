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
}

export function useCommonConditionsLogic<T extends ICondition | IValidation>(
    disabled: boolean,
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
    () => void,
] {
    const [virtualCondition, setVirtualCondition] = useState<T | null>(
        service.getVirtualCondition(),
    );
    const [questions, setQuestions] = useState<IPuzzle[]>([]);
    const [answers, setAnswers] = useState<IPuzzle[]>([]);

    const isPuzzle = (object: unknown): object is IPuzzle => _.has(object, "puzzleType");

    const { puzzleType: parentPuzzleType } = isPuzzle(parent) ? parent : { puzzleType: undefined };

    const initial = useRef(false);
    useEffect(() => {
        if (service.getConditions().length > 0 && !initial.current) {
            setVirtualCondition(null);
        }
        initial.current = true;
    }, [service]);

    // hook for invalidating conditions if
    // dependent question has changed
    const conditions = service.getConditions();
    const prevConditions = useRef(conditions);
    useEffect(() => {
        const filter: number[] = [];
        conditions.forEach((condition, index, array) => {
            let dependentsChanged = false;
            const dependents = questions.find(
                question => question.id === service.getRightPuzzle(condition),
            );
            if (!dependents) {
                return;
            }
            puzzles.forEach(puzzle => {
                // find dependent question in template
                if (puzzle.puzzleType !== EPuzzleType.QUESTION || puzzle.id !== dependents.id) {
                    return;
                }
                // check if dependent question has changed
                dependentsChanged = service.checkDependentQuestionChanged(dependents, puzzle);
            });
            if (dependentsChanged) {
                service.resetConditions(condition);
                array[index] = { ...condition };
                if (index > 0) {
                    filter.push(index);
                }
            }
        });
        const nextConditions = service
            .getConditions()
            .filter((_value, index) => !filter.includes(index));
        if (!_.isEqual(prevConditions.current, nextConditions)) {
            prevConditions.current = _.cloneDeep(nextConditions);
            service.setConditions(nextConditions);
        }
    }, [conditions, puzzles, questions, service]);

    const { puzzles: parentPuzzles } = parent || { puzzles: [] };
    const prevPuzzle = useRef(_.cloneDeep(puzzle));
    const prevQuestions = useRef(_.cloneDeep(questions));
    const prevAnswers = useRef(_.cloneDeep(answers));
    useEffect(() => {
        if (disabled) {
            return;
        }
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
                childPuzzle.title.toString().length > 0
            ) {
                questions.push(childPuzzle);
                childPuzzle.puzzles.forEach(childOfChildPuzzle => {
                    // if puzzle is one of answers types
                    // then it's allowed to be selected as an answerPuzzle
                    const excludedPuzzleTypes = [EPuzzleType.GROUP, EPuzzleType.QUESTION];
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
        if (!_.isEqual(prevPuzzle.current, puzzle)) {
            prevPuzzle.current = _.cloneDeep(puzzle);
            service.onConditionsChange(virtualCondition);
        }
    }, [
        answers,
        disabled,
        parent,
        parentPuzzleType,
        parentPuzzles,
        puzzle,
        questions,
        service,
        virtualCondition,
    ]);

    const onConditionDeleteCallback = useCallback(
        (id: string) => {
            if (virtualCondition && virtualCondition.id === id) {
                if (puzzle.conditions.length > 0) {
                    setVirtualCondition(null);
                } else {
                    setVirtualCondition(service.getVirtualCondition());
                }
            } else {
                service.setConditions([
                    ...service.getConditions().filter(condition => condition.id !== id),
                ]);
                if (service.getConditions().length === 0) {
                    setVirtualCondition(service.getVirtualCondition());
                }
                onTemplateChange();
            }
        },
        [onTemplateChange, puzzle.conditions.length, service, virtualCondition],
    );

    const onConditionChangeCallback = useCallback(
        (id: string, update: T): void => {
            if (virtualCondition && virtualCondition.id === id) {
                setVirtualCondition({ ...virtualCondition, ...update });
            } else {
                const changedConditionIdx = service
                    .getConditions()
                    .findIndex(condition => condition.id === id);
                service.getConditions()[changedConditionIdx] = {
                    ...service.getConditions()[changedConditionIdx],
                    ...update,
                };
                service.setConditions([...service.getConditions()]);
                onTemplateChange();
            }
        },
        [onTemplateChange, service, virtualCondition],
    );

    const onAddConditionCallback = useCallback(
        (onAddConditionImpl: (last: T) => Partial<T>): void => {
            service.onConditionsChange(virtualCondition);
            const last = _.last(service.getConditions());
            if (last) {
                setVirtualCondition({
                    ...service.getVirtualCondition(),
                    ...onAddConditionImpl(last),
                });
            }
        },
        [service, virtualCondition],
    );

    const onConditionsBlur = useCallback(() => {
        if (disabled) {
            return;
        }
        if (service.filterConditions(virtualCondition).length > 0) {
            setVirtualCondition(null);
        }
        service.onConditionsChange(virtualCondition);
    }, [disabled, service, virtualCondition]);

    return [
        questions,
        answers,
        virtualCondition,
        setVirtualCondition,
        onConditionDeleteCallback,
        onConditionChangeCallback,
        onAddConditionCallback,
        onConditionsBlur,
    ];
}
