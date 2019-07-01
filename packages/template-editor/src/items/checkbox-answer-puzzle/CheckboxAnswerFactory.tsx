import { IPuzzleFactory, IPuzzleFactoryProps } from "../../services/item";
import { ReactNode } from "react";
import { EditorContext, IEditorContext } from "../../TemplateEditor";
import { CheckboxAnswerPuzzle } from "./CheckboxAnswerPuzzle";
import { jsx } from "@emotion/core";

export class CheckboxAnswerFactory implements IPuzzleFactory {
    createItem({ item, focused, ...rest }: IPuzzleFactoryProps): ReactNode {
        return (
            <EditorContext.Consumer>
                {({ onAddAnswerPuzzle, onDeleteAnswerPuzzle, ...context }: IEditorContext) => (
                    <CheckboxAnswerPuzzle
                        {...context}
                        {...rest}
                        {...{ id: item.id, title: item.title, questionFocused: focused }}
                        onAddCheckboxButton={onAddAnswerPuzzle}
                        onDeleteCheckboxButton={onDeleteAnswerPuzzle}
                        addCheckboxButton={!!focused}
                    />
                )}
            </EditorContext.Consumer>
        );
    }
}
