import * as React from "react";
interface IPuzzleToolbarProps {
    right?: number;
    top?: number;
    onAddClick(): void;
    onMouseOver(): void;
    onMouseOut(): void;
}
export declare const PuzzleToolbar: React.FC<IPuzzleToolbarProps>;
export {};
