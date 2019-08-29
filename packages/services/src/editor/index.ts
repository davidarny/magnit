import {
    EditorServiceImpl,
    TFocusedPuzzleState,
    TToolbarTopPositionState,
} from "./EditorServiceImpl";
import { IEditorService } from "./IEditorService";
import { TaskEditorService } from "./TaskEditorService";
import { TemplateEditorService } from "./TemplateEditorService";

export enum EEditorType {
    TEMPLATE = 0,
    TASK,
}

export function getEditorService(
    type: EEditorType,
    args: [TFocusedPuzzleState, TToolbarTopPositionState],
): IEditorService {
    switch (type) {
        case EEditorType.TASK:
            return new TaskEditorService(...args);
        case EEditorType.TEMPLATE:
            return new TemplateEditorService(...args);
        default:
            console.log("%c%s", `color:#F07178`, `Current type (${type}) service does not exist!`);
            return new EditorServiceImpl(...args);
    }
}

export * from "./IEditorService";
