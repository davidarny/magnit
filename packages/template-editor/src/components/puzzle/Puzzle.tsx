/** @jsx jsx */

import * as React from "react";
import { ReactNode } from "react";
import { jsx } from "@emotion/core";
import { PuzzleWrapper } from "./PuzzleWrapper";
import { IPuzzle } from "entities";
import { Paper } from "@material-ui/core";
import { EPuzzleType } from "./EPuzzleType";

interface IPuzzleProps {
    puzzles: IPuzzle[];
    index: number;
    components: {
        [EPuzzleType.GROUP](index: number, id: string): ReactNode;
        [EPuzzleType.QUESTION](index: number, id: string, title: string): ReactNode;
        [EPuzzleType.TEXT_ANSWER](index: number, id: string): ReactNode;
        [EPuzzleType.NUMERIC_ANSWER](index: number, id: string): ReactNode;
        [EPuzzleType.RADIO_ANSWER](index: number, id: string, title: string): ReactNode;
    };

    isFocused(id: string): boolean;

    isInFocusedChain(id: string): boolean;

    onFocus(id: string): void;

    onMouseDown(event: React.SyntheticEvent, id: string): void;

    onBlur(event: React.SyntheticEvent): void;
}

export const Puzzle: React.FC<IPuzzleProps> = ({ puzzles, ...props }) => {
    return (
        <React.Fragment>
            {puzzles.map((puzzle, index) => {
                function onFocus(): void {
                    props.onFocus(puzzle.id);
                }

                switch (puzzle.puzzleType) {
                    case EPuzzleType.GROUP: {
                        return (
                            <Paper
                                key={puzzle.id}
                                id={puzzle.id}
                                onFocus={onFocus}
                                onBlur={props.onBlur}
                                onMouseDown={event => props.onMouseDown(event, puzzle.id)}
                                css={theme => ({
                                    position: "relative",
                                    paddingTop: theme.spacing(2),
                                    marginTop: theme.spacing(index === 0 ? 4 : 0),
                                    paddingBottom: theme.spacing(2),
                                    marginBottom: theme.spacing(
                                        index === puzzles.length - 1 ? 4 : 0
                                    ),
                                    zIndex: props.isFocused(puzzle.id)
                                        ? 1300
                                        : props.isInFocusedChain(puzzle.id)
                                        ? 1200
                                        : 0,
                                })}
                                square={true}
                                elevation={props.isFocused(puzzle.id) ? 16 : 0}
                            >
                                <PuzzleWrapper>
                                    {props.components[EPuzzleType.GROUP](index, puzzle.id)}
                                </PuzzleWrapper>
                                <Puzzle puzzles={puzzle.puzzles} index={props.index} {...props} />
                            </Paper>
                        );
                    }
                    case EPuzzleType.QUESTION: {
                        return (
                            <Paper
                                key={puzzle.id}
                                id={puzzle.id}
                                css={theme => ({
                                    position: "relative",
                                    paddingTop: theme.spacing(2),
                                    marginTop: theme.spacing(index === 0 ? 2 : 0),
                                    paddingBottom: theme.spacing(2),
                                    marginBottom: theme.spacing(
                                        index === puzzles.length - 1 ? 0 : 2
                                    ),
                                    zIndex: props.isFocused(puzzle.id) ? 1300 : 0,
                                })}
                                onMouseDown={event => props.onMouseDown(event, puzzle.id)}
                                onFocus={onFocus}
                                onBlur={props.onBlur}
                                square={true}
                                elevation={props.isFocused(puzzle.id) ? 16 : 0}
                            >
                                <PuzzleWrapper>
                                    {props.components[EPuzzleType.QUESTION](
                                        index,
                                        puzzle.id,
                                        puzzle.title
                                    )}
                                </PuzzleWrapper>
                                <Puzzle puzzles={puzzle.puzzles} index={props.index} {...props} />
                            </Paper>
                        );
                    }
                    case EPuzzleType.TEXT_ANSWER:
                        return (
                            <div
                                key={puzzle.id}
                                css={theme => ({
                                    marginTop: theme.spacing(2),
                                    marginBottom: theme.spacing(2),
                                })}
                            >
                                <PuzzleWrapper>
                                    {props.components[EPuzzleType.TEXT_ANSWER](index, puzzle.id)}
                                </PuzzleWrapper>
                                <Puzzle puzzles={puzzle.puzzles} index={props.index} {...props} />
                            </div>
                        );
                    case EPuzzleType.NUMERIC_ANSWER:
                        return (
                            <div
                                key={puzzle.id}
                                css={theme => ({
                                    marginTop: theme.spacing(2),
                                    marginBottom: theme.spacing(2),
                                })}
                            >
                                <PuzzleWrapper>
                                    {props.components[EPuzzleType.NUMERIC_ANSWER](index, puzzle.id)}
                                </PuzzleWrapper>
                                <Puzzle puzzles={puzzle.puzzles} index={props.index} {...props} />
                            </div>
                        );
                    case EPuzzleType.RADIO_ANSWER:
                        return (
                            <div
                                key={puzzle.id}
                                css={theme => ({
                                    marginTop: theme.spacing(2),
                                    marginBottom: theme.spacing(2),
                                })}
                            >
                                <PuzzleWrapper>
                                    {props.components[EPuzzleType.RADIO_ANSWER](
                                        index,
                                        puzzle.id,
                                        puzzle.title
                                    )}
                                </PuzzleWrapper>
                                <Puzzle puzzles={puzzle.puzzles} index={props.index} {...props} />
                            </div>
                        );
                    default:
                        return <React.Fragment />;
                }
            })}
        </React.Fragment>
    );
};
