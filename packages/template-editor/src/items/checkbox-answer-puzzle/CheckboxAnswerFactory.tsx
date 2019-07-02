/** @jsx jsx */

import * as React from "react";
import { jsx } from "@emotion/core";
import { IPuzzleFactory, IPuzzleFactoryProps } from "services/item";
import { EditorContext, IEditorContext } from "TemplateEditor";
import { CheckboxAnswerPuzzle } from "./CheckboxAnswerPuzzle";

export class CheckboxAnswerFactory implements IPuzzleFactory {
    createPuzzle({ puzzle, parentPuzzle, focused, ...rest }: IPuzzleFactoryProps): React.ReactNode {
        return (
            <EditorContext.Consumer>
                {({ onAddAnswerPuzzle, onDeleteAnswerPuzzle, ...context }: IEditorContext) => (
                    <CheckboxAnswerPuzzle
                        {...context}
                        {...rest}
                        {...{ id: puzzle.id, title: puzzle.title, questionFocused: focused }}
                        onAddCheckboxButton={onAddAnswerPuzzle}
                        onDeleteCheckboxButton={onDeleteAnswerPuzzle}
                        addCheckboxButton={
                            !!parentPuzzle && parentPuzzle.puzzles.length - 1 === rest.index
                        }
                    />
                )}
            </EditorContext.Consumer>
        );
    }
}
