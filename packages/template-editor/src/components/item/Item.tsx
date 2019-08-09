/** @jsx jsx */

import * as React from "react";
import { jsx } from "@emotion/core";
import { IPuzzle } from "entities";
import { GroupOfItems } from "components/group-of-items";

interface IContentProps {
    puzzles: IPuzzle[];

    onFocus(id: string): void;

    onBlur(event: React.SyntheticEvent): void;

    isFocused(id: string): boolean;
}

export const Item: React.FC<IContentProps> = ({ puzzles, ...props }) => {
    if (!puzzles) {
        return null;
    }
    return (
        <React.Fragment>
            {puzzles.map((puzzle, index) => {
                return (
                    <GroupOfItems
                        key={puzzle.id}
                        puzzle={puzzle}
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
