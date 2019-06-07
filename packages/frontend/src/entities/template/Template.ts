interface ITitled {
    title: string;
}

interface IOrdered {
    order: number;
}

interface IWithId {
    id: string;
}

interface IWithPuzzles<T> {
    puzzles: T[];
}

interface IWithConditions<T> {
    conditions: T[];
}

interface IWithValidation<T> {
    validations: T[];
}

interface ICondition extends IOrdered {
    parentPuzzle: IPuzzle["id"];
    childPuzzle: IPuzzle["id"];
    actionType: "chosen_answer";
    conditionType: "and" | "or";
}

interface IValidation extends IOrdered {
    leftHandPuzzle: IPuzzle["id"];
    rightHandPuzzle?: IPuzzle["id"];
    value?: number;
    operatorType: "more_than" | "less_than" | "equal" | "less_or_equal" | "more_or_equal";
    validationType: "compare_with_answer" | "set_value";
    errorMessage: string;
}

export interface ITemplate extends ITitled, IWithId {
    description: string;
    sections: ISection[];
}

export interface ISection extends IOrdered, ITitled, IWithPuzzles<IPuzzle>, IWithId {
    puzzles: IPuzzle[];
}

export interface IPuzzle
    extends IOrdered,
        ITitled,
        IWithPuzzles<IPuzzle>,
        IWithId,
        IWithConditions<ICondition>,
        IWithValidation<IValidation> {
    puzzleType: "group" | "question" | "radio_answer" | "dropdown_answer" | "input_answer";
}

export interface ISpecificPuzzleProps {
    index: number;
}
