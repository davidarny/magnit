/** @jsx jsx */

import * as React from "react";
import { jsx } from "@emotion/core";
import { IPuzzle } from "../../entities";
import { ContentGroup } from "./ContentGroup";

interface IContentProps {
    puzzles: IPuzzle[];

    onFocus(id: string): void;

    onBlur(event: React.SyntheticEvent): void;

    isFocused(id: string): boolean;
}

export const Content: React.FC<IContentProps> = ({ puzzles, ...props }) => {
    return (
        <React.Fragment>
            {puzzles.map((puzzle, index) => {
                return (
                    <ContentGroup
                        key={puzzle.id}
                        item={puzzle}
                        onFocus={props.onFocus}
                        onBlur={props.onBlur}
                        isFocused={props.isFocused}
                        index={index}
                    />
                );
            })}
        </React.Fragment>
    );
};
