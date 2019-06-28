import * as React from "react";
import { QuestionPuzzle } from "./QuestionPuzzle";
import { jsx } from "@emotion/core";
import { IPuzzleFactory, IPuzzleFactoryProps } from "../../services/item";
import { EditorContext, IEditorContext } from "index";

export class QuestionFactory implements IPuzzleFactory {
    createItem({item, ...rest}: IPuzzleFactoryProps): React.ReactNode {
        return (
            <EditorContext.Consumer>
                {
                    ({template, onTemplateChange}: IEditorContext) => (
                        <QuestionPuzzle
                            {...rest}
                            {...{template, onTemplateChange, id: item.id, title: item.title}}
                        />
                    )
                }
            </EditorContext.Consumer>
        );
    }
}