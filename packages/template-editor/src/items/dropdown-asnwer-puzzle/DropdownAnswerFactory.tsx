/** @jsx jsx */

import * as React from "react";
import { jsx } from "@emotion/core";
import { IPuzzleFactory, IPuzzleFactoryProps } from "services/item";
import { EditorContext, IEditorContext } from "TemplateEditor";
import { DropdownAnswerPuzzle } from "./DropdownAnswerPuzzle";

export class DropdownAnswerFactory implements IPuzzleFactory {
    createItem({ puzzle, parentPuzzle, focused, ...rest }: IPuzzleFactoryProps): React.ReactNode {
        const addDropdownButton = !!parentPuzzle && parentPuzzle.puzzles.length - 1 === rest.index;
        return (
            <EditorContext.Consumer>
                {({ onAddAnswerPuzzle, onDeleteAnswerPuzzle, ...context }: IEditorContext) => (
                    <DropdownAnswerPuzzle
                        {...rest}
                        {...context}
                        {...{ id: puzzle.id, title: puzzle.title, questionFocused: focused }}
                        onAddDropdownButton={onAddAnswerPuzzle}
                        onDeleteDropdownButton={onDeleteAnswerPuzzle}
                        addDropdownButton={addDropdownButton}
                    />
                )}
            </EditorContext.Consumer>
        );
    }
}
