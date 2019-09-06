import { IPuzzle, ISection, ITemplate } from "@magnit/entities";
import * as React from "react";

export interface ICache {
    sections: Map<string, ISection>;
    puzzles: Map<string, IPuzzle>;
}

export interface IEditorContext {
    template: ITemplate;
    cache: ICache;

    onTemplateChange(template: ITemplate): void;

    onAddAnswerPuzzle(id: string, addition?: Partial<IPuzzle>): void;

    onDeleteAnswerPuzzle(id: string): void;

    onUploadAsset(file: File): Promise<{ filename: string }>;

    onDeleteAsset(filename: string): Promise<unknown>;
}

export const EditorContext = React.createContext<IEditorContext>(
    new (class implements IEditorContext {
        cache!: ICache;
        template!: ITemplate;

        onAddAnswerPuzzle(id: string, addition?: Partial<IPuzzle>): void {
            throw new Error("Not implemented");
        }

        onDeleteAnswerPuzzle(id: string): void {
            throw new Error("Not implemented");
        }

        async onDeleteAsset(filename: string): Promise<unknown> {
            throw new Error("Not implemented");
        }

        onTemplateChange(template: ITemplate): void {
            throw new Error("Not implemented");
        }

        onUploadAsset(file: File): Promise<{ filename: string }> {
            throw new Error("Not implemented");
        }
    })(),
);
