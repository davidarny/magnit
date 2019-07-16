/** @jsx jsx */

import * as React from "react";
import { jsx } from "@emotion/core";
import { IPuzzleFactory, IPuzzleFactoryProps } from "services/item";
import { TextAnswer } from "./TextAnswer";

export class TextAnswerFactory implements IPuzzleFactory {
    create({ puzzle, focused, ...props }: IPuzzleFactoryProps): React.ReactNode {
        return <TextAnswer id={puzzle.id} focused={focused} {...props} />;
    }
}
