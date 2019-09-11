export interface IEditorService {
    onPuzzleFocus(id: string, force?: boolean): void;

    updateToolbarTopPosition(): void;
}
