import { ReactNode } from "react";
import { EPuzzleType } from "../../components/puzzle";
import { QuestionFactory } from "../../items/question-puzzle";
import * as React from "../../components/puzzle/Puzzle";
import { jsx } from "@emotion/core";
import { IPuzzle } from "../../entities";
import { GroupFactory } from "../../items/group-puzzle";
import { DropdownAnswerFactory } from "../../items/dropdown-asnwer-puzzle";
import { DateAnswerFactory } from "../../items/date-answer-puzzle";
import { TextAnswerFactory } from "../../items/text-answer-puzzle";
import { CheckboxAnswerFactory } from "../../items/checkbox-answer-puzzle";
import { RadioAnswerFactory } from "../../items/radio-answer-puzzle";
import { NumericAnswerFactory } from "../../items/numeric-answer-puzzle";

export interface IPuzzleFactory {
    createItem(params: IPuzzleFactoryProps): ReactNode;
}

export interface IPuzzleFactoryProps {
    index: number;
    focused: boolean;
    item: IPuzzle;
}

class DefaultFactory implements IPuzzleFactory {
    createItem({ item }: IPuzzleFactoryProps): ReactNode {
        return <div key={item.id} />;
    }
}

export const getFactory = (type: EPuzzleType): IPuzzleFactory => {
    switch (type) {
        case EPuzzleType.QUESTION:
            return new QuestionFactory();
        case EPuzzleType.GROUP:
            return new GroupFactory();
        case EPuzzleType.DROPDOWN_ANSWER:
            return new DropdownAnswerFactory();
        case EPuzzleType.DATE_ANSWER:
            return new DateAnswerFactory();
        case EPuzzleType.TEXT_ANSWER:
            return new TextAnswerFactory();
        case EPuzzleType.CHECKBOX_ANSWER:
            return new CheckboxAnswerFactory();
        case EPuzzleType.RADIO_ANSWER:
            return new RadioAnswerFactory();
        case EPuzzleType.NUMERIC_ANSWER:
            return new NumericAnswerFactory();
        default:
            console.warn(`Current type (${type}) factory is not exist`);
            return new DefaultFactory();
    }
};
