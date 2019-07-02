/** @jsx jsx */

import * as React from "react";
import { jsx } from "@emotion/core";
import { IPuzzleFactory, IPuzzleFactoryProps } from "services/item";
import { EditorContext, IEditorContext } from "TemplateEditor";
import { CheckboxAnswerPuzzle } from "./CheckboxAnswerPuzzle";

export class CheckboxAnswerFactory implements IPuzzleFactory {
    createItem({ item, parentItem, focused, ...rest }: IPuzzleFactoryProps): React.ReactNode {
        return (
            <EditorContext.Consumer>
                {({ onAddAnswerPuzzle, onDeleteAnswerPuzzle, ...context }: IEditorContext) => (
                    <CheckboxAnswerPuzzle
                        {...context}
                        {...rest}
                        {...{ id: item.id, title: item.title, questionFocused: focused }}
                        onAddCheckboxButton={onAddAnswerPuzzle}
                        onDeleteCheckboxButton={onDeleteAnswerPuzzle}
                        addCheckboxButton={
                            !!parentItem && parentItem.puzzles.length - 1 === rest.index
                        }
                    />
                )}
            </EditorContext.Consumer>
        );
    }
}
