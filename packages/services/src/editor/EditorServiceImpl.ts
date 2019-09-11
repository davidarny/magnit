import _ from "lodash";
import * as React from "react";
import { IEditorService } from "./IEditorService";

export type TFocusedPuzzleState = [string[], React.Dispatch<React.SetStateAction<string[]>>];
export type TToolbarTopPositionState = [number, React.Dispatch<React.SetStateAction<number>>];

export class EditorServiceImpl implements IEditorService {
    private WAIT = 250;

    private readonly debouncedChainCleaning: () => void;

    constructor(
        private focusedPuzzleState: TFocusedPuzzleState,
        private toolbarTopPositionState: TToolbarTopPositionState,
    ) {
        this.debouncedChainCleaning = _.debounce(
            () => {
                const [focusedPuzzleChain] = this.focusedPuzzleState;
                focusedPuzzleChain.length = 0;
            },
            this.WAIT,
            { leading: true, trailing: false },
        );
    }

    onPuzzleFocus(id: string, force?: boolean): void {
        const [focusedPuzzleChain, setFocusedPuzzleChain] = this.focusedPuzzleState;
        this.debouncedChainCleaning();
        if (focusedPuzzleChain.includes(id)) {
            setFocusedPuzzleChain([...focusedPuzzleChain]);
            return;
        }
        if (force) {
            focusedPuzzleChain.length = 0;
        }
        focusedPuzzleChain.push(id);
        setFocusedPuzzleChain([...focusedPuzzleChain]);
    }

    updateToolbarTopPosition(): void {
        const [focusedPuzzleChain] = this.focusedPuzzleState;
        const [, setToolbarTopPosition] = this.toolbarTopPositionState;
        if (!focusedPuzzleChain.length) {
            return;
        }
        const focusedPuzzleId = _.first(focusedPuzzleChain);
        if (!focusedPuzzleId) {
            return;
        }
        const element = document.getElementById(focusedPuzzleId);
        if (!element) {
            return;
        }
        const { top } = element.getBoundingClientRect();
        setToolbarTopPosition(window.scrollY + top - 128);
    }
}
