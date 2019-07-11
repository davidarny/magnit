/** @jsx jsx */

import * as React from "react";
import { jsx } from "@emotion/core";
import { IPuzzleFactory, IPuzzleFactoryProps } from "services/item";
import { TextAnswerPuzzle } from "./TextAnswerPuzzle";

export class TextAnswerFactory implements IPuzzleFactory {
    create({ puzzle, focused, ...props }: IPuzzleFactoryProps): React.ReactNode {
        return <TextAnswerPuzzle id={puzzle.id} focused={focused} {...props} />;
    }
}
