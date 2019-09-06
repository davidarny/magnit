/** @jsx jsx */

import { jsx } from "@emotion/core";
import { EPuzzleType } from "@magnit/services";
import { CheckboxAnswerFactory, DropdownAnswerFactory, RadioAnswerFactory } from "puzzles";
import * as React from "react";

export interface IPuzzleFactory {
    create(props: IPuzzleProps): React.ReactNode;
}

export interface IPuzzleProps {
    index: number;
    puzzle: object;
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
        default:
            return new DefaultFactory();
    }
}
