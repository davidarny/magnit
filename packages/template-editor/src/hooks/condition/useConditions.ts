import { EConditionType, ICondition, IPuzzle, ITemplate } from "@magnit/entities";
import { IUseConditionsService, useCommonConditionsLogic } from "hooks/condition-common";
import _ from "lodash";
import { useCallback, useRef, useState } from "react";
import uuid from "uuid/v4";

export function useConditions(
    template: ITemplate,
    disabled: boolean,
    puzzleId: string,
    onTemplateChange: (template: ITemplate) => void,
    initialState?: ICondition[],
): [
    ICondition[],
    IPuzzle[],
    IPuzzle[],
    (id: string) => void,
    (id: string, nextCondition: Partial<ICondition>) => void,
    () => void,
] {
    const defaultState = useRef({
        id: uuid(),
        order: 0,
        questionPuzzle: "",
        answerPuzzle: "",
        value: "",
        actionType: "",
        conditionType: EConditionType.OR,
    });
    const [conditions, setConditions] = useState<ICondition[]>(
        _.isArray(initialState) && !_.isEmpty(initialState) ? initialState : [defaultState.current],
    );

    const useConditionService: IUseConditionsService<ICondition> = {
        checkDependentQuestionChanged(leftQuestion: IPuzzle, rightQuestion: IPuzzle): boolean {
            return !_.isEqual(
                _.omit(leftQuestion, "conditions"),
                _.omit(rightQuestion, "conditions"),
            );
        },

        getConditionObjects(): ICondition[] {
            return conditions;
        },

        getRightPuzzle(condition: ICondition): string {
            return condition.questionPuzzle!;
        },

        resetConditionObject(condition: ICondition): void {
            condition.answerPuzzle = "";
            condition.value = "";
            condition.actionType = "";
        },

        setPuzzleConditionObjects(puzzle: IPuzzle, index: number): void {
            puzzle.puzzles[index].conditions = [...conditions].filter(
                condition =>
                    !!(
                        condition.actionType &&
                        condition.conditionType &&
                        condition.questionPuzzle &&
                        (condition.value || condition.answerPuzzle)
                    ),
            );
        },

        shouldSetQuestions(_puzzle: IPuzzle): boolean {
            return true;
        },
    };

    const [questions, answers] = useCommonConditionsLogic<ICondition>(
        template,
        disabled,
        puzzleId,
        useConditionService,
        onTemplateChange,
    );

    const onConditionDeleteCallback = useCallback(
        (id: string) => {
            // do not allow to delete if only one condition present
            if (conditions.length === 1) {
                setConditions([defaultState.current]);
                return;
            }
            setConditions([...conditions.filter(condition => condition.id !== id)]);
        },
        [conditions, defaultState],
    );

    const onConditionChangeCallback = useCallback(
        (id: string, nextCondition: Partial<ICondition>): void => {
            const changedConditionIdx = conditions.findIndex(condition => condition.id === id);
            conditions[changedConditionIdx] = {
                ...conditions[changedConditionIdx],
                ...nextCondition,
            };
            setConditions([...conditions]);
        },
        [conditions],
    );

    const onAddConditionCallback = useCallback((): void => {
        if (
            questions.length === 0 ||
            (conditions.length !== 0 && !conditions.some(condition => !!condition.questionPuzzle))
        ) {
            return;
        }
        const conditionsHead = _.head(conditions) || { questionPuzzle: "" };
        conditions.push({
            ...defaultState.current,
            id: uuid(),
            order: conditions.length - 1,
            questionPuzzle: conditionsHead.questionPuzzle,
        });
        setConditions([...conditions]);
    }, [conditions, questions.length]);

    return [
        conditions,
        questions,
        answers,
        onConditionDeleteCallback,
        onConditionChangeCallback,
        onAddConditionCallback,
    ];
}
