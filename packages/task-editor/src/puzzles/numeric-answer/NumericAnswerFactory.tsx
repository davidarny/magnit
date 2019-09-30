/** @jsx jsx */

import { jsx } from "@emotion/core";
import * as React from "react";
import { IPuzzleFactory, IPuzzleProps } from "services/item";
import { NumericAnswer } from "./NumericAnswer";

export class NumericAnswerFactory implements IPuzzleFactory {
    create(props: IPuzzleProps): React.ReactNode {
        return <NumericAnswer key={props.puzzle.id} {...props} />;
    }
}
