/** @jsx jsx */

import { jsx } from "@emotion/core";
import * as React from "react";
import { IPuzzleFactory, IPuzzleProps } from "services/item";
import { CheckboxAnswer } from "./CheckboxAnswer";

export class CheckboxAnswerFactory implements IPuzzleFactory {
    create(props: IPuzzleProps): React.ReactNode {
        return <CheckboxAnswer key={props.puzzle.id} {...props} />;
    }
}
