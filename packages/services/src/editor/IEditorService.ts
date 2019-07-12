import * as React from "react";

export interface IEditorService {
    onPuzzleFocus(id: string): void;

    onPuzzleBlur(event: React.SyntheticEvent): void;
}
