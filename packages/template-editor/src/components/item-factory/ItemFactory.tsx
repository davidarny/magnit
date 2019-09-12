/** @jsx jsx */

import { jsx } from "@emotion/core";
import { EPuzzleType, IPuzzle } from "@magnit/entities";
import { Grid } from "@material-ui/core";
import { PuzzleWrapper } from "components/puzzle-wrapper";
import * as React from "react";
import { getPuzzleFactory } from "services/item";

interface IContentItemProps {
    deep?: boolean;
    puzzle: IPuzzle;
    index: number;
    active?: boolean;
    parentPuzzle?: IPuzzle;
    noWrapper?: boolean;

    onFocus(): void;
}

export const ItemFactory: React.FC<IContentItemProps> = props => {
    const { puzzle, parentPuzzle, deep = false, index, active, noWrapper, onFocus } = props;
    const factory = getPuzzleFactory(puzzle.puzzleType);

    return (
        <React.Fragment>
            <PuzzleWrapper
                id={puzzle.id}
                onFocus={onFocus}
                onMouseDown={onFocus}
                noWrapper={noWrapper}
            >
                {factory.create({
                    focused: !!active,
                    puzzle: puzzle,
                    index: index,
                    parentPuzzle: parentPuzzle,
                })}
                {deep && (
                    <Grid container spacing={2}>
                        {(puzzle.puzzles || []).map((childPuzzle, index) => {
                            return (
                                <ItemFactory
                                    noWrapper={true}
                                    puzzle={childPuzzle}
                                    index={index}
                                    active={active}
                                    onFocus={onFocus}
                                    key={index}
                                    parentPuzzle={puzzle}
                                />
                            );
                        })}
                        {puzzle.puzzleType === EPuzzleType.REFERENCE_ANSWER &&
                            getPuzzleFactory(EPuzzleType.REFERENCE_ASSET).create({
                                focused: !!active,
                                puzzle: {
                                    id: puzzle.id,
                                    puzzleType: EPuzzleType.REFERENCE_ASSET,
                                    title: "",
                                    description: "",
                                    order: puzzle.puzzles.length,
                                    puzzles: [],
                                    conditions: [],
                                    validations: [],
                                },
                                parentPuzzle: puzzle,
                                index: puzzle.puzzles.length,
                            })}
                    </Grid>
                )}
            </PuzzleWrapper>
        </React.Fragment>
    );
};

ItemFactory.displayName = "ItemFactory";
