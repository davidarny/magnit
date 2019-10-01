/** @jsx jsx */

import { jsx } from "@emotion/core";
import React from "react";
import { IPuzzleFactory, IPuzzleProps } from "services/item";
import { ReferenceAnswer } from "./ReferenceAnswer";

export class ReferenceAnswerFactory implements IPuzzleFactory {
    create(props: IPuzzleProps): React.ReactNode {
        return <ReferenceAnswer key={props.puzzle.id} {...props} />;
    }
}
