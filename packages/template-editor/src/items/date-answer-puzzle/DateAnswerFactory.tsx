/** @jsx jsx */

import { IPuzzleFactory, IPuzzleFactoryProps } from "../../services/item";
import { ReactNode } from "react";
import { EditorContext, IEditorContext } from "../../TemplateEditor";
import { DateAnswerPuzzle } from "./DateAnswerPuzzle";
import { jsx } from "@emotion/core";

export class DateAnswerFactory implements IPuzzleFactory {
    createItem({ item, focused, index }: IPuzzleFactoryProps): ReactNode {
        return (
            <EditorContext.Consumer>
                {(context: IEditorContext) => (
                    <DateAnswerPuzzle questionFocused={!!focused} id={item.id} index={index} />
                )}
            </EditorContext.Consumer>
        );
    }
}
