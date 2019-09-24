import { EConditionType, ICondition, IPuzzle, ISection } from "@magnit/entities";
import { IUseConditionsService, useCommonConditionsLogic } from "hooks/condition-common";
import _ from "lodash";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import uuid from "uuid/v4";

export function useConditions(
    puzzle: IPuzzle,
    puzzles: Map<string, IPuzzle>,
    disabled: boolean,
    onTemplateChange: () => void,
    parent: IPuzzle | ISection,
): [
    ICondition | null,
    IPuzzle[],
    IPuzzle[],
    (id: string) => void,
    (id: string, nextCondition: ICondition) => void,
    () => void,
] {
    const [virtualCondition, setVirtualCondition] = useState<ICondition | null>({
        id: uuid(),
        answerPuzzle: "",
        value: "",
        actionType: "",
        conditionType: EConditionType.OR,
        order: 0,
        questionPuzzle: "",
    });

    const useConditionService: IUseConditionsService<ICondition> = useMemo(
        () => ({
            checkDependentQuestionChanged(leftQuestion: IPuzzle, rightQuestion: IPuzzle): boolean {
                return !_.isEqual(
                    _.omit(leftQuestion, "conditions"),
                    _.omit(rightQuestion, "conditions"),
                );
            },

            setConditions(conditions: ICondition[]) {
                puzzle.conditions = [...conditions];
            },

            getConditions(): ICondition[] {
                return puzzle.conditions;
            },

            getRightPuzzle(condition: ICondition): string {
                return condition.questionPuzzle!;
            },

            resetConditions(condition: ICondition): void {
                condition.answerPuzzle = "";
                condition.value = "";
                condition.actionType = "";
            },

            onConditionsChange(): void {
                puzzle.conditions = [...puzzle.conditions, virtualCondition].filter<ICondition>(
                    (condition): condition is ICondition =>
                        !_.isNil(condition) &&
                        !!(
                            condition.actionType &&
                            condition.conditionType &&
                            condition.questionPuzzle &&
                            (condition.value || condition.answerPuzzle)
                        ),
                );
                onTemplateChange();
            },

            shouldSetQuestions(_puzzle: IPuzzle): boolean {
                return true;
            },
        }),
        [puzzle.conditions, onTemplateChange, virtualCondition],
    );

    const [questions, answers] = useCommonConditionsLogic<ICondition>(
        puzzle,
        puzzles,
        parent,
        useConditionService,
    );

    const initial = useRef(false);
    useEffect(() => {
        if (puzzle.conditions.length > 0 && !initial.current) {
            setVirtualCondition(null);
        }
        initial.current = true;
    }, [puzzle.conditions.length]);

    const onConditionDeleteCallback = useCallback(
        (id: string) => {
            if (virtualCondition && virtualCondition.id === id) {
                if (puzzle.conditions.length > 0) {
                    setVirtualCondition(null);
                } else {
                    setVirtualCondition({
                        id: uuid(),
                        answerPuzzle: "",
                        value: "",
                        actionType: "",
                        conditionType: EConditionType.OR,
                        order: 0,
                        questionPuzzle: "",
                    });
                }
            } else {
                puzzle.conditions = [...puzzle.conditions.filter(condition => condition.id !== id)];
                if (puzzle.conditions.length === 0) {
                    setVirtualCondition({
                        id: uuid(),
                        answerPuzzle: "",
                        value: "",
                        actionType: "",
                        conditionType: EConditionType.OR,
                        order: 0,
                        questionPuzzle: "",
                    });
                }
                onTemplateChange();
            }
        },
        [puzzle.conditions, onTemplateChange, virtualCondition],
    );

    const onConditionChangeCallback = useCallback(
        (id: string, update: ICondition): void => {
            if (virtualCondition && virtualCondition.id === id) {
                setVirtualCondition({ ...virtualCondition, ...update });
            } else {
                const changedConditionIdx = puzzle.conditions.findIndex(
                    condition => condition.id === id,
                );
                puzzle.conditions[changedConditionIdx] = {
                    ...puzzle.conditions[changedConditionIdx],
                    ...update,
                };
                puzzle.conditions = [...puzzle.conditions];
                onTemplateChange();
            }
        },
        [puzzle.conditions, onTemplateChange, virtualCondition],
    );

    const onAddConditionCallback = useCallback((): void => {
        useConditionService.onConditionsChange();
        const last = _.last(puzzle.conditions);
        if (last) {
            setVirtualCondition({
                id: uuid(),
                answerPuzzle: "",
                value: "",
                actionType: "",
                conditionType: EConditionType.OR,
                order: last.order + 1,
                questionPuzzle: last.questionPuzzle,
            });
        }
    }, [puzzle.conditions, useConditionService]);

    return [
        virtualCondition,
        questions,
        answers,
        onConditionDeleteCallback,
        onConditionChangeCallback,
        onAddConditionCallback,
    ];
}
