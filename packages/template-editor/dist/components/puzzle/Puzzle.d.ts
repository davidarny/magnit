import * as React from "react";
import { ReactNode } from "react";
import { IPuzzle } from "entities";
import { EPuzzleType } from "./EPuzzleType";
interface IPuzzleProps {
    puzzles: IPuzzle[];
    index: number;
    components: {
        [EPuzzleType.GROUP](index: number): ReactNode;
        [EPuzzleType.QUESTION](index: number): ReactNode;
        [EPuzzleType.INPUT_ANSWER](index: number): ReactNode;
    };
    shouldElevatePuzzle(id: string): boolean;
    isInFocusedChain(id: string): boolean;
    onFocus(id: string): void;
    onBlur(event: React.SyntheticEvent): void;
}
export declare const Puzzle: React.FC<IPuzzleProps>;
export {};
