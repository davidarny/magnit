import { EConditionType, ICondition, IPuzzle, ISection } from "@magnit/entities";
import { IUseConditionsService, useCommonConditionsLogic } from "hooks/condition-common";
import _ from "lodash";
import { useCallback, useMemo } from "react";
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
    (event?: MouseEvent) => void,
] {
    const useConditionService = useMemo<IUseConditionsService<ICondition>>(
        () => ({
            getVirtualCondition() {
                return {
                    id: uuid(),
                    answerPuzzle: "",
                    value: "",
                    actionType: "",
                    conditionType: EConditionType.OR,
                    order: 0,
                    questionPuzzle: "",
                };
            },

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

            filterConditions(virtualCondition: ICondition | null): ICondition[] {
                return [...puzzle.conditions, _.cloneDeep(virtualCondition)].filter<ICondition>(
                    (condition): condition is ICondition =>
                        !_.isNil(condition) &&
                        !!(
                            condition.actionType &&
                            condition.conditionType &&
                            condition.questionPuzzle &&
                            (condition.value || condition.answerPuzzle)
                        ),
                );
            },

            onConditionsChange(virtualCondition: ICondition | null): void {
                puzzle.conditions = this.filterConditions(virtualCondition);
                onTemplateChange();
            },

            shouldSetQuestions(_puzzle: IPuzzle): boolean {
                return true;
            },
        }),
        [onTemplateChange, puzzle.conditions],
    );

    const [
        questions,
        answers,
        virtualCondition,
        ,
        onConditionDelete,
        onConditionChange,
        onAddCondition,
        onConditionsBlur,
    ] = useCommonConditionsLogic<ICondition>(
        puzzle,
        puzzles,
        parent,
        useConditionService,
        onTemplateChange,
    );

    const onConditionDeleteCallback = useCallback(
        (id: string) => {
            onConditionDelete(id);
        },
        [onConditionDelete],
    );

    const onConditionChangeCallback = useCallback(
        (id: string, update: ICondition): void => {
            onConditionChange(id, update);
        },
        [onConditionChange],
    );

    const onAddConditionCallback = useCallback((): void => {
        onAddCondition(last => ({
            order: last.order + 1,
            questionPuzzle: last.questionPuzzle,
        }));
    }, [onAddCondition]);

    return [
        virtualCondition,
        questions,
        answers,
        onConditionDeleteCallback,
        onConditionChangeCallback,
        onAddConditionCallback,
        onConditionsBlur,
    ];
}
