import { EPuzzleType, ICondition, IPuzzle, ITemplate, IValidation } from "@magnit/entities";
import _ from "lodash";
import { useEffect, useRef, useState } from "react";
import { traverse } from "services/json";

export interface IUseConditionsService<T> {
    getConditionObjects(): T[];

    getRightPuzzle(condition: T): string;

    resetConditionObject(condition: T): void;

    checkDependentQuestionChanged(leftQuestion: IPuzzle, rightQuestion: IPuzzle): boolean;

    setPuzzleConditionObjects(puzzle: IPuzzle, index: number): void;

    shouldSetQuestions(puzzle: IPuzzle): boolean;
}

export function useCommonConditionsLogic<T extends ICondition | IValidation>(
    template: ITemplate,
    disabled: boolean,
    puzzleId: string,
    service: IUseConditionsService<T>,
    onTemplateChange: (template: ITemplate) => void,
): [IPuzzle[], IPuzzle[]] {
    const [questions, setQuestions] = useState<IPuzzle[]>([]);
    const [answers, setAnswers] = useState<IPuzzle[]>([]);

    const templateSnapshot = useRef<ITemplate>({} as ITemplate);
    const isParentPuzzleGroup = useRef(false);

    useEffect(() => {
        if (disabled) {
            return;
        }
        traverse(template, (value: IPuzzle, parent: IPuzzle) => {
            if (!_.has(value, "puzzles") || !_.has(parent, "puzzles")) {
                return;
            }
            const isGroupParent = parent.puzzleType === EPuzzleType.GROUP;
            isParentPuzzleGroup.current = value.id === puzzleId && isGroupParent;
        });
    }, [template, disabled, puzzleId]);

    const prevQuestions = useRef(_.cloneDeep(questions));
    const prevAnswers = useRef(_.cloneDeep(answers));
    useEffect(() => {
        if (disabled) {
            return;
        }
        // track if template is changed
        // outside of this component
        if (!_.isEqual(template, templateSnapshot.current)) {
            service.getConditionObjects().forEach((condition, index, array) => {
                let hasDependentQuestionChanged = false;
                const dependentQuestion = questions.find(
                    question => question.id === service.getRightPuzzle(condition),
                );
                if (dependentQuestion) {
                    traverse(template, (value: IPuzzle) => {
                        if (!_.has(value, "puzzles")) {
                            return;
                        }
                        // find dependent question in template
                        if (
                            value.puzzleType !== EPuzzleType.QUESTION ||
                            value.id !== dependentQuestion.id
                        ) {
                            return;
                        }
                        // check if dependent question has changed
                        hasDependentQuestionChanged = service.checkDependentQuestionChanged(
                            dependentQuestion,
                            value,
                        );
                    });
                    if (hasDependentQuestionChanged) {
                        service.resetConditionObject(condition);
                        array[index] = { ...condition };
                    }
                }
            });
        }
        // fill questions and answers initially
        // by traversing whole template tree
        questions.length = 0;
        answers.length = 0;
        traverse(template, (value: any) => {
            if (!_.has(value, "puzzles")) {
                return;
            }
            const puzzle = value as IPuzzle;
            if (!puzzle.puzzles.some(child => child.id === puzzleId)) {
                return;
            }
            // find index of current puzzle in a tree
            const index = puzzle.puzzles.findIndex(item => item.id === puzzleId);
            // traverse all children of parent puzzle
            // in order to find all possible siblings above
            // so that scope of questionPuzzle is always all puzzles above the current
            _.range(0, index).forEach(i => {
                traverse(puzzle.puzzles[i], (childValue: IPuzzle, childParent: IPuzzle) => {
                    if (!_.has(childValue, "puzzleType") || !_.has(childValue, "puzzles")) {
                        return;
                    }
                    // check if parent of current item is GROUP puzzle
                    const isGroupParent =
                        childParent &&
                        childParent.puzzleType === EPuzzleType.GROUP &&
                        !isParentPuzzleGroup.current;
                    // if puzzle is question and has non-empty title
                    // then it's allowed to be selected as a questionPuzzle
                    // disallow referencing to questions in GROUPS
                    if (
                        childValue.puzzleType === EPuzzleType.QUESTION &&
                        service.shouldSetQuestions(childValue) &&
                        childValue.title.toString().length > 0 &&
                        !isGroupParent
                    ) {
                        questions.push(childValue);
                        return;
                    }
                    // if puzzle is one of answers types
                    // then it's allowed to be selected as an answerPuzzle
                    const excludedPuzzleTypes = [EPuzzleType.GROUP, EPuzzleType.QUESTION];
                    if (!excludedPuzzleTypes.includes(childValue.puzzleType)) {
                        answers.push(childValue);
                        return;
                    }
                });
            });
            // set conditions of current puzzle
            service.setPuzzleConditionObjects(puzzle, index);
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
        // trigger template update if snapshot changed
        // also cloneDeep in order to track changes above in isEqual
        const clonedTemplate = _.cloneDeep(template);
        if (_.isEqual(template, templateSnapshot.current) || _.isEmpty(templateSnapshot.current)) {
            templateSnapshot.current = clonedTemplate;
            return;
        }
        templateSnapshot.current = clonedTemplate;
        onTemplateChange(templateSnapshot.current);
    }, [template, disabled, questions, answers, onTemplateChange, puzzleId, service]);

    return [questions, answers];
}
