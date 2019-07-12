import { IEditorService } from "./IEditorService";
import { TaskEditorService } from "./TaskEditorService";
import { TemplateEditorService } from "./TemplateEditorService";
import { EditorServiceImpl, TFocusedPuzzleState } from "./EditorServiceImpl";

export enum EEditorType {
    TEMPLATE = 0,
    TASK,
}

export function getEditorService(type: EEditorType, args: [TFocusedPuzzleState]): IEditorService {
    switch (type) {
        case EEditorType.TASK:
            return new TaskEditorService(...args);
        case EEditorType.TEMPLATE:
            return new TemplateEditorService(...args);
        default:
            console.log(
                "%c%s",
                "color:" + "#F07178",
                `Current type (${type}) service does not exist!`
            );
            return new EditorServiceImpl(...args);
    }
}
