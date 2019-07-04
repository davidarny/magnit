/** @jsx jsx */

import * as React from "react";
import { jsx } from "@emotion/core";
import { IPuzzleFactory, IPuzzleFactoryProps } from "services/item";
import { DateAnswerPuzzle } from "./DateAnswerPuzzle";

export class DateAnswerFactory implements IPuzzleFactory {
    createPuzzle({ puzzle, focused, index, ...props }: IPuzzleFactoryProps): React.ReactNode {
        return <DateAnswerPuzzle focused={focused} id={puzzle.id} index={index} {...props} />;
    }
}
