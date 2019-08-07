/** @jsx jsx */

import { jsx } from "@emotion/core";
import { IPuzzleFactory, IPuzzleFactoryProps } from "services/item";
import * as React from "react";
import { ReferenceText } from "./ReferenceText";

export class ReferenceTextFactory implements IPuzzleFactory {
    create({ puzzle, focused, ...props }: IPuzzleFactoryProps): React.ReactNode {
        return <ReferenceText id={puzzle.id} focused={focused} {...props} />;
    }
}
