/** @jsx jsx */

import * as React from "react";
import { ReactNode } from "react";
import { jsx } from "@emotion/core";
import { PuzzleWrapper } from "./PuzzleWrapper";
import { IPuzzle } from "entities/template";
import { WithToolbar } from "../with-toolbar";

interface IPuzzleProps {
    puzzles: IPuzzle[];
    index: number;
    components: {
        group(index: number): ReactNode;

        question(index: number): ReactNode;
    };
}

export const Puzzle: React.FC<IPuzzleProps> = ({ puzzles, ...props }) => {
    return (
        <>
            {puzzles.map((puzzle, index) => {
                switch (puzzle.puzzleType) {
                    case "group": {
                        return (
                            <WithToolbar key={puzzle.id}>
                                <PuzzleWrapper index={index} id={puzzle.id}>
                                    {props.components.group(index)}
                                </PuzzleWrapper>
                                <Puzzle puzzles={puzzle.puzzles} index={props.index} {...props} />
                            </WithToolbar>
                        );
                    }
                    case "question": {
                        return (
                            <WithToolbar key={puzzle.id}>
                                <PuzzleWrapper index={index} id={puzzle.id}>
                                    {props.components.question(index)}
                                </PuzzleWrapper>
                                <Puzzle puzzles={puzzle.puzzles} index={props.index} {...props} />
                            </WithToolbar>
                        );
                    }
                    default:
                        return null;
                }
            })}
        </>
    );
};
