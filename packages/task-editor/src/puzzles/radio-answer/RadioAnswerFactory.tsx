/** @jsx jsx */

import { jsx } from "@emotion/core";
import * as React from "react";
import { IPuzzleFactory, IPuzzleProps } from "services/item";
import { RadioAnswer } from "./RadioAnswer";

export class RadioAnswerFactory implements IPuzzleFactory {
    create(props: IPuzzleProps): React.ReactNode {
        return <RadioAnswer key={props.puzzle.id} {...props} />;
    }
}
