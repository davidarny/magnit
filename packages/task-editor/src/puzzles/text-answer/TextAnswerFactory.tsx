/** @jsx jsx */

import { jsx } from "@emotion/core";
import * as React from "react";
import { IPuzzleFactory, IPuzzleProps } from "services/item";
import { TextAnswer } from "./TextAnswer";

export class TextAnswerFactory implements IPuzzleFactory {
    create(props: IPuzzleProps): React.ReactNode {
        return <TextAnswer key={props.puzzle.id} {...props} />;
    }
}
