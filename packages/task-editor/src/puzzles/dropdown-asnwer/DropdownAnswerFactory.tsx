/** @jsx jsx */

import { jsx } from "@emotion/core";
import * as React from "react";
import { IPuzzleFactory, IPuzzleProps } from "services/item";
import { DropdownAnswer } from "./DropdownAnswer";

export class DropdownAnswerFactory implements IPuzzleFactory {
    create(props: IPuzzleProps): React.ReactNode {
        return <DropdownAnswer key={props.puzzle.id} {...props} />;
    }
}
