/** @jsx jsx */

import { jsx } from "@emotion/core";
import { PuzzleWrapper } from "../puzzle/PuzzleWrapper";
import * as React from "react";
import { IPuzzle } from "../../entities";
import { getFactory } from "../../services/item";

interface IContentItem {
    item: IPuzzle;
    index: number;
    active?: boolean;

    onMouseDown?(): void;
}

export const ContentItem: React.FC<IContentItem> = ({ item, ...props }) => {
    const factory = getFactory(item.puzzleType);
    const view = factory.createItem({
        focused: !!props.active,
        item: item,
        index: props.index
    });
    return (
        <PuzzleWrapper>
            {view}
        </PuzzleWrapper>
    );
};
