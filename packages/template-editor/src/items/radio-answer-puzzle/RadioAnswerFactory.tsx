/** @jsx jsx */

import * as React from "react";
import { jsx } from "@emotion/core";
import { RadioAnswerPuzzle } from "./RadioAnswerPuzzle";
import { EditorContext, IEditorContext } from "TemplateEditor";
import { IPuzzleFactory, IPuzzleFactoryProps } from "services/item";

export class RadioAnswerFactory implements IPuzzleFactory {
    createItem({ puzzle, parentPuzzle, focused, ...rest }: IPuzzleFactoryProps): React.ReactNode {
        return (
            <EditorContext.Consumer>
                {({ onAddAnswerPuzzle, onDeleteAnswerPuzzle, ...context }: IEditorContext) => (
                    <RadioAnswerPuzzle
                        {...{ id: puzzle.id, title: puzzle.title, questionFocused: focused }}
                        {...rest}
                        {...context}
                        onAddRadioButton={onAddAnswerPuzzle}
                        onDeleteRadioButton={onDeleteAnswerPuzzle}
                        addRadioButton={
                            !!parentPuzzle && parentPuzzle.puzzles.length - 1 === rest.index
                        }
                    />
                )}
            </EditorContext.Consumer>
        );
    }
}
