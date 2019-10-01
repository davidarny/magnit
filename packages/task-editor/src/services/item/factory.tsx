/** @jsx jsx */

import { jsx } from "@emotion/core";
import { EPuzzleType, IAnswer, IPuzzle } from "@magnit/entities";
import {
    CheckboxAnswerFactory,
    DropdownAnswerFactory,
    RadioAnswerFactory,
    ReferenceAnswerFactory,
    TextAnswerFactory,
} from "puzzles";
import * as React from "react";

export interface IPuzzleFactory {
    create(props: IPuzzleProps): React.ReactNode;
}

export interface IPuzzleProps {
    index: number;
    answer?: IAnswer;
    puzzle: IPuzzle;
}

class DefaultFactory implements IPuzzleFactory {
    create(props: IPuzzleProps): React.ReactNode {
        return <div key={props.index} />;
    }
}

export function getPuzzleFactory(type: EPuzzleType): IPuzzleFactory {
    switch (type) {
        case EPuzzleType.CHECKBOX_ANSWER:
            return new CheckboxAnswerFactory();
        case EPuzzleType.RADIO_ANSWER:
            return new RadioAnswerFactory();
        case EPuzzleType.DROPDOWN_ANSWER:
            return new DropdownAnswerFactory();
        case EPuzzleType.TEXT_ANSWER:
        case EPuzzleType.NUMERIC_ANSWER:
        case EPuzzleType.DATE_ANSWER:
            return new TextAnswerFactory();
        case EPuzzleType.REFERENCE_ANSWER:
            return new ReferenceAnswerFactory();
        default:
            return new DefaultFactory();
    }
}
