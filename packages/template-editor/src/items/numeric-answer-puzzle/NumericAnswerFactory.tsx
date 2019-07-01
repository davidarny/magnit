/** @jsx jsx */

import { IPuzzleFactory, IPuzzleFactoryProps } from "../../services/item";
import { ReactNode } from "react";
import { EditorContext, IEditorContext } from "../../TemplateEditor";
import { NumericAnswerPuzzle } from "./NumericAnswerPuzzle";
import { jsx } from "@emotion/core";

export class NumericAnswerFactory implements IPuzzleFactory {
    createItem({ item, focused, ...rest }: IPuzzleFactoryProps): ReactNode {
        return (
            <EditorContext.Consumer>
                {(context: IEditorContext) => (
                    <NumericAnswerPuzzle {...{ id: item.id, questionFocused: focused }} {...rest} />
                )}
            </EditorContext.Consumer>
        );
    }
}
