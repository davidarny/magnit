/** @jsx jsx */

import * as React from "react";
import { jsx } from "@emotion/core";
import { IPuzzleFactory, IPuzzleFactoryProps } from "services/item";
import { EditorContext, IEditorContext } from "TemplateEditor";
import { DropdownAnswerPuzzle } from "./DropdownAnswerPuzzle";

export class DropdownAnswerFactory implements IPuzzleFactory {
    createItem({ item, parentItem, focused, ...rest }: IPuzzleFactoryProps): React.ReactNode {
        const addDropdownButton = !!parentItem && parentItem.puzzles.length - 1 === rest.index;
        return (
            <EditorContext.Consumer>
                {({ onAddAnswerPuzzle, onDeleteAnswerPuzzle, ...context }: IEditorContext) => (
                    <DropdownAnswerPuzzle
                        {...rest}
                        {...context}
                        {...{ id: item.id, title: item.title, questionFocused: focused }}
                        onAddDropdownButton={onAddAnswerPuzzle}
                        onDeleteDropdownButton={onDeleteAnswerPuzzle}
                        addDropdownButton={addDropdownButton}
                    />
                )}
            </EditorContext.Consumer>
        );
    }
}
