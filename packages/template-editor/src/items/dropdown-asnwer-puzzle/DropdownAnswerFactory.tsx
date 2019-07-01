import { IPuzzleFactory, IPuzzleFactoryProps } from "../../services/item";
import * as React from "react";
import { EditorContext, IEditorContext } from "../../TemplateEditor";
import { jsx } from "@emotion/core";
import { DropdownAnswerPuzzle } from "./DropdownAnswerPuzzle";

export class DropdownAnswerFactory implements IPuzzleFactory {
    createItem({ item, parentItem, focused, ...rest }: IPuzzleFactoryProps): React.ReactNode {
        return (
            <EditorContext.Consumer>
                {({ onAddAnswerPuzzle, onDeleteAnswerPuzzle, ...context }: IEditorContext) => (
                    <DropdownAnswerPuzzle
                        {...rest}
                        {...context}
                        {...{ id: item.id, title: item.title, questionFocused: focused }}
                        onAddDropdownButton={onAddAnswerPuzzle}
                        onDeleteDropdownButton={onDeleteAnswerPuzzle}
                        addDropdownButton={
                            !!parentItem && parentItem.puzzles.length - 1 === rest.index
                        }
                    />
                )}
            </EditorContext.Consumer>
        );
    }
}
