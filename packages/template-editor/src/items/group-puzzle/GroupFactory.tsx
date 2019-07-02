/** @jsx jsx */

import { jsx } from "@emotion/core";
import * as React from "react";
import { IPuzzleFactory, IPuzzleFactoryProps } from "services/item";
import { GroupPuzzle } from "./GroupPuzzle";
import { EditorContext } from "TemplateEditor";

export class GroupFactory implements IPuzzleFactory {
    createItem({ item, ...rest }: IPuzzleFactoryProps): React.ReactNode {
        return <EditorContext.Consumer>{() => <GroupPuzzle />}</EditorContext.Consumer>;
    }
}
