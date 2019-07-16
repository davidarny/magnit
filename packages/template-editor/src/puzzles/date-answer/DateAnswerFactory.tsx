/** @jsx jsx */

import * as React from "react";
import { jsx } from "@emotion/core";
import { IPuzzleFactory, IPuzzleFactoryProps } from "services/item";
import { DateAnswer } from "./DateAnswer";

export class DateAnswerFactory implements IPuzzleFactory {
    create({ puzzle, focused, index, ...props }: IPuzzleFactoryProps): React.ReactNode {
        return <DateAnswer focused={focused} id={puzzle.id} index={index} {...props} />;
    }
}
