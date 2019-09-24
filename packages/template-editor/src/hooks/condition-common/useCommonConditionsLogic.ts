import { EPuzzleType, ICondition, IPuzzle, ISection, IValidation } from "@magnit/entities";
import _ from "lodash";
import { useEffect, useRef, useState } from "react";

export interface IUseConditionsService<T> {
    setConditions(conditions: T[]): void;

    getConditions(): T[];

    getRightPuzzle(condition: T): string;

    resetConditions(condition: T): void;

    checkDependentQuestionChanged(leftQuestion: IPuzzle, rightQuestion: IPuzzle): boolean;

    onConditionsChange(): void;

    shouldSetQuestions(puzzle: IPuzzle): boolean;
}

export function useCommonConditionsLogic<T extends ICondition | IValidation>(
    puzzle: IPuzzle,
    puzzles: Map<string, IPuzzle>,
    parent: IPuzzle | ISection,
    service: IUseConditionsService<T>,
): [IPuzzle[], IPuzzle[]] {
    const [questions, setQuestions] = useState<IPuzzle[]>([]);
    const [answers, setAnswers] = useState<IPuzzle[]>([]);

    const isPuzzle = (object: unknown): object is IPuzzle => _.has(object, "puzzleType");

    const { puzzleType: parentPuzzleType } = isPuzzle(parent) ? parent : { puzzleType: undefined };

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
            service.onConditionsChange();
        }
    }, [answers, parent, parentPuzzleType, parentPuzzles, puzzle, questions, service]);

    return [questions, answers];
}
