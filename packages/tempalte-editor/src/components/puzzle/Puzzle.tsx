/** @jsx jsx */

import * as React from "react";
import { ReactNode } from "react";
import { jsx } from "@emotion/core";
import { PuzzleWrapper } from "./PuzzleWrapper";
import { EPuzzleType, IPuzzle } from "entities";
import { Paper } from "@material-ui/core";

interface IPuzzleProps {
    puzzles: IPuzzle[];
    index: number;
    components: {
        [EPuzzleType.GROUP](index: number): ReactNode;
        [EPuzzleType.QUESTION](index: number): ReactNode;
        [EPuzzleType.INPUT_ANSWER](index: number): ReactNode;
    };

    shouldElevatePuzzle(id: string): boolean;

    onFocus(id: string): void;
}

export const Puzzle: React.FC<IPuzzleProps> = ({ puzzles, ...props }) => {
    return (
        <React.Fragment>
            {puzzles.map((puzzle, index) => {
                switch (puzzle.puzzleType) {
                    case EPuzzleType.GROUP: {
                        return (
                            <Paper
                                key={puzzle.id}
                                id={puzzle.id}
                                onFocus={event => {
                                    event.stopPropagation();
                                    props.onFocus(puzzle.id);
                                }}
                                css={theme => ({
                                    paddingTop: theme.spacing(2),
                                    marginTop: theme.spacing(index === 0 ? 4 : 0),
                                    paddingBottom: theme.spacing(2),
                                    marginBottom: theme.spacing(
                                        index === puzzles.length - 1 ? 4 : 0
                                    ),
                                    paddingLeft: theme.spacing(4),
                                    paddingRight: theme.spacing(4),
                                    zIndex: props.shouldElevatePuzzle(puzzle.id) ? 1300 : 0,
                                    position: "relative",
                                })}
                                square={true}
                                elevation={props.shouldElevatePuzzle(puzzle.id) ? 16 : 0}
                            >
                                <PuzzleWrapper>
                                    {props.components[EPuzzleType.GROUP](index)}
                                </PuzzleWrapper>
                                <Puzzle puzzles={puzzle.puzzles} index={props.index} {...props} />
                            </Paper>
                        );
                    }
                    case EPuzzleType.QUESTION: {
                        return (
                            <div
                                key={puzzle.id}
                                css={theme => ({
                                    marginTop: theme.spacing(2),
                                    marginBottom: theme.spacing(2),
                                })}
                            >
                                <PuzzleWrapper>
                                    {props.components[EPuzzleType.QUESTION](index)}
                                </PuzzleWrapper>
                                <Puzzle puzzles={puzzle.puzzles} index={props.index} {...props} />
                            </div>
                        );
                    }
                    case EPuzzleType.INPUT_ANSWER:
                        return (
                            <div
                                key={puzzle.id}
                                css={theme => ({
                                    marginTop: theme.spacing(2),
                                    marginBottom: theme.spacing(2),
                                })}
                            >
                                <PuzzleWrapper>
                                    {props.components[EPuzzleType.INPUT_ANSWER](index)}
                                </PuzzleWrapper>
                                <Puzzle puzzles={puzzle.puzzles} index={props.index} {...props} />
                            </div>
                        );
                    default:
                        return null;
                }
            })}
        </React.Fragment>
    );
};
