/** @jsx jsx */

import { jsx } from "@emotion/core";
import { PuzzleWrapper } from "../puzzle/PuzzleWrapper";
import * as React from "react";
import { IPuzzle } from "../../entities";

interface IContentItem {
    item: IPuzzle;
    index: number;
    active?: boolean;

    onMouseDown?(): void;
}

export const ContentItem: React.FC<IContentItem> = ({ children, ...props }) => {
    return <PuzzleWrapper>{props.item.title}</PuzzleWrapper>;
};
