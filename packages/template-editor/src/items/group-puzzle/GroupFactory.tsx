/** @jsx jsx */

import { jsx } from "@emotion/core";
import * as React from "react";
import { IPuzzleFactory, IPuzzleFactoryProps } from "services/item";
import { GroupPuzzle } from "./GroupPuzzle";

export class GroupFactory implements IPuzzleFactory {
    createPuzzle({ puzzle, ...rest }: IPuzzleFactoryProps): React.ReactNode {
        return <GroupPuzzle />;
    }
}
