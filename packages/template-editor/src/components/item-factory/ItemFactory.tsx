/** @jsx jsx */

import * as React from "react";
import { jsx } from "@emotion/core";
import { PuzzleWrapper } from "components/puzzle-wrapper";
import { IPuzzle } from "entities";
import { getPuzzleFactory } from "services/item";
import { Grid } from "@material-ui/core";

interface IContentItemProps {
    deep?: boolean;
    puzzle: IPuzzle;
    index: number;
    active?: boolean;
    parentPuzzle?: IPuzzle;
    noWrapper?: boolean;

    onFocus(): void;
}

export const ItemFactory: React.FC<IContentItemProps> = ({ puzzle, deep = false, ...props }) => {
    const factory = getPuzzleFactory(puzzle.puzzleType);
    return (
        <React.Fragment>
            <PuzzleWrapper
                id={puzzle.id}
                onFocus={props.onFocus}
                onMouseDown={props.onFocus}
                noWrapper={props.noWrapper}
            >
                {factory.create({
                    focused: !!props.active,
                    puzzle: puzzle,
                    index: props.index,
                    parentPuzzle: props.parentPuzzle,
                })}
                {deep && (
                    <Grid container spacing={2}>
                        {(puzzle.puzzles || []).map((childPuzzle, index) => {
                            return (
                                <ItemFactory
                                    noWrapper={true}
                                    puzzle={childPuzzle}
                                    index={index}
                                    active={props.active}
                                    onFocus={props.onFocus}
                                    key={index}
                                    parentPuzzle={puzzle}
                                />
                            );
                        })}
                    </Grid>
                )}
            </PuzzleWrapper>
        </React.Fragment>
    );
};
