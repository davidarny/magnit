/** @jsx jsx */

import * as React from "react";
import { jsx } from "@emotion/core";
import { IPuzzleFactory, IPuzzleFactoryProps } from "services/item";
import { NumericAnswerPuzzle } from "./NumericAnswerPuzzle";

export class NumericAnswerFactory implements IPuzzleFactory {
    create({ puzzle, focused, ...props }: IPuzzleFactoryProps): React.ReactNode {
        return <NumericAnswerPuzzle {...props} id={puzzle.id} focused={focused} />;
    }
}
