import * as React from "react";
import { IEditorService } from "./IEditorService";
import _ from "lodash";

export type TFocusedPuzzleState = [string[], React.Dispatch<React.SetStateAction<string[]>>];
export type TToolbarTopPositionState = [number, React.Dispatch<React.SetStateAction<number>>];

export class EditorServiceImpl implements IEditorService {
    private readonly throttledChainCleaning: () => void;

    constructor(
        private focusedPuzzleState: TFocusedPuzzleState,
        private toolbarTopPositionState: TToolbarTopPositionState
    ) {
        const wait = 100;
        this.throttledChainCleaning = _.throttle(() => {
            const [focusedPuzzleChain] = this.focusedPuzzleState;
            focusedPuzzleChain.length = 0;
        }, wait);
    }

    onPuzzleFocus(id: string): void {
        const [focusedPuzzleChain, setFocusedPuzzleChain] = this.focusedPuzzleState;
        this.throttledChainCleaning();
        if (focusedPuzzleChain.includes(id)) {
            setFocusedPuzzleChain([...focusedPuzzleChain]);
            return;
        }
        focusedPuzzleChain.push(id);
        setFocusedPuzzleChain([...focusedPuzzleChain]);
    }

    onPuzzleBlur(event: React.SyntheticEvent<Element, Event>): void {
        event.preventDefault();
        event.stopPropagation();
    }

    updateToolbarTopPosition(): void {
        const [focusedPuzzleChain] = this.focusedPuzzleState;
        const [, setToolbarTopPosition] = this.toolbarTopPositionState;
        if (!focusedPuzzleChain.length) {
            return;
        }
        const focusedPuzzleId = _.head(focusedPuzzleChain);
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
