import {
    EActionType,
    EConditionType,
    EPuzzleType,
    ICondition,
    IPuzzle,
    ISection,
} from "@magnit/entities";
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
] {
    const useConditionService = useMemo<IUseConditionsService<ICondition>>(
        () => ({
            getVirtualCondition() {
                return {
                    id: uuid(),
                    order: 0,
                    actionType: "" as EActionType,
                    questionPuzzle: "",
                    conditionType: EConditionType.OR,
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
                condition.actionType = "" as EActionType;
            },

            filterConditions(virtualCondition: ICondition | null): ICondition[] {
                return [...puzzle.conditions, _.cloneDeep(virtualCondition)].filter<ICondition>(
                    (condition): condition is ICondition =>
                        !_.isNil(condition) &&
                        !!(
                            condition.actionType &&
                            condition.conditionType &&
                            condition.questionPuzzle &&
                            (condition.actionType === EActionType.GIVEN_ANSWER ||
                                (condition.actionType === EActionType.CHOSEN_ANSWER
                                    ? condition.answerPuzzle
                                    : condition.actionType === EActionType.EQUAL ||
                                      condition.actionType === EActionType.LESS_THAN ||
                                      condition.actionType === EActionType.MORE_THAN ||
                                      condition.actionType === EActionType.NOT_EQUAL
                                    ? condition.value
                                    : false))
                        ),
                );
            },

            onConditionsChange(virtualCondition: ICondition | null): void {
                puzzle.conditions = this.filterConditions(virtualCondition);
                onTemplateChange();
            },

            shouldSetQuestions(puzzle: IPuzzle): boolean {
                // do not allow to reference question if of type reference
                return puzzle.puzzles.every(
                    child => child.puzzleType !== EPuzzleType.REFERENCE_ANSWER,
                );
            },

            conditionsEmpty(): boolean {
                return puzzle.conditions.length === 0;
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
    ];
}
