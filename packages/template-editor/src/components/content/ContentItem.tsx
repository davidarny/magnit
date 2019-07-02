/** @jsx jsx */

import * as React from "react";
import { jsx } from "@emotion/core";
import { PuzzleWrapper } from "components/puzzle";
import { IPuzzle } from "entities";
import { getFactory } from "services/item";

interface IContentItem {
    item: IPuzzle;
    parentItem?: IPuzzle;
    index: number;
    active?: boolean;

    onFocus(): void;

    onBlur(event: React.SyntheticEvent): void;
}

export const ContentItem: React.FC<IContentItem> = ({ item, parentItem, ...props }) => {
    const factory = getFactory(item.puzzleType);
    const view = factory.createItem({
        focused: !!props.active,
        item: item,
        index: props.index,
        parentItem,
    });
    return (
        <PuzzleWrapper
            id={item.id}
            onFocus={props.onFocus}
            onMouseDown={props.onFocus}
            onBlur={props.onBlur}
        >
            {view}
        </PuzzleWrapper>
    );
};
