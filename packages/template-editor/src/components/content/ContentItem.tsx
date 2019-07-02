/** @jsx jsx */

import * as React from "react";
import { jsx } from "@emotion/core";
import { PuzzleWrapper } from "components/puzzle";
import { IPuzzle } from "entities";
import { getFactory } from "services/item";

interface IContentItem {
    puzzle: IPuzzle;
    parentPuzzle?: IPuzzle;
    index: number;
    active?: boolean;

    onFocus(): void;

    onBlur(event: React.SyntheticEvent): void;
}

export const ContentItem: React.FC<IContentItem> = ({ puzzle, parentPuzzle, ...props }) => {
    const factory = getFactory(puzzle.puzzleType);
    const view = factory.createItem({
        focused: !!props.active,
        puzzle: puzzle,
        index: props.index,
        parentPuzzle: parentPuzzle,
    });
    return (
        <PuzzleWrapper
            id={puzzle.id}
            onFocus={props.onFocus}
            onMouseDown={props.onFocus}
            onBlur={props.onBlur}
        >
            {view}
        </PuzzleWrapper>
    );
};
