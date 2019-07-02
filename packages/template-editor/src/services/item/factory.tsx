/** @jsx jsx */

import * as React from "react";
import { jsx } from "@emotion/core";
import { EPuzzleType } from "components/puzzle";
import { QuestionFactory } from "items/question-puzzle";
import { IPuzzle } from "entities";
import { GroupFactory } from "items/group-puzzle";
import { DropdownAnswerFactory } from "items/dropdown-asnwer-puzzle";
import { DateAnswerFactory } from "items/date-answer-puzzle";
import { TextAnswerFactory } from "items/text-answer-puzzle";
import { CheckboxAnswerFactory } from "items/checkbox-answer-puzzle";
import { RadioAnswerFactory } from "items/radio-answer-puzzle";
import { NumericAnswerFactory } from "items/numeric-answer-puzzle";

export interface IPuzzleFactory {
    createItem(params: IPuzzleFactoryProps): React.ReactNode;
}

export interface IPuzzleFactoryProps {
    index: number;
    focused: boolean;
    puzzle: IPuzzle;
    parentPuzzle?: IPuzzle;
}

class DefaultFactory implements IPuzzleFactory {
    createItem({ puzzle }: IPuzzleFactoryProps): React.ReactNode {
        return <div key={puzzle.id} />;
    }
}

export function getFactory(type: EPuzzleType): IPuzzleFactory {
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
            console.warn(`Current type (${type}) factory does not exist!`);
            return new DefaultFactory();
    }
}
