/** @jsx jsx */

import { RadioAnswerPuzzle } from "./RadioAnswerPuzzle";
import { EditorContext, IEditorContext } from "../../TemplateEditor";
import { IPuzzleFactory, IPuzzleFactoryProps } from "../../services/item";
import { ReactNode } from "react";
import { jsx } from "@emotion/core";

export class RadioAnswerFactory implements IPuzzleFactory {
    createItem({ item, parentItem, focused, ...rest }: IPuzzleFactoryProps): ReactNode {
        return (
            <EditorContext.Consumer>
                {({ onAddAnswerPuzzle, onDeleteAnswerPuzzle, ...context }: IEditorContext) => (
                    <RadioAnswerPuzzle
                        {...{ id: item.id, title: item.title, questionFocused: focused }}
                        {...rest}
                        {...context}
                        onAddRadioButton={onAddAnswerPuzzle}
                        onDeleteRadioButton={onDeleteAnswerPuzzle}
                        addRadioButton={
                            !!parentItem && parentItem.puzzles.length - 1 === rest.index
                        }
                    />
                )}
            </EditorContext.Consumer>
        );
    }
}
