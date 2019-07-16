/** @jsx jsx */

import * as React from "react";
import { jsx } from "@emotion/core";
import { EPuzzleType } from "@magnit/services";
import { IPuzzle } from "entities";
import {
    NumericAnswerFactory,
    RadioAnswerFactory,
    CheckboxAnswerFactory,
    TextAnswerFactory,
    DateAnswerFactory,
    DropdownAnswerFactory,
    GroupFactory,
    QuestionFactory,
} from "puzzles";

export interface IPuzzleFactory {
    create(params: IPuzzleFactoryProps): React.ReactNode;
}

export interface IPuzzleFactoryProps {
    index: number;
    focused: boolean;
    puzzle: IPuzzle;
    parentPuzzle?: IPuzzle;
}

class DefaultFactory implements IPuzzleFactory {
    create({ puzzle }: IPuzzleFactoryProps): React.ReactNode {
        return <div key={puzzle.id} />;
    }
}

export function getPuzzleFactory(type: EPuzzleType): IPuzzleFactory {
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
            console.log(
                "%c%s",
                "color:" + "#F07178",
                `${type.toUpperCase()} factory does not exist!`
            );
            return new DefaultFactory();
    }
}
