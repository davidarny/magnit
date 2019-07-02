/** @jsx jsx */

import * as React from "react";
import { jsx } from "@emotion/core";
import { IPuzzleFactory, IPuzzleFactoryProps } from "services/item";
import { EditorContext } from "TemplateEditor";
import { TextAnswerPuzzle } from "./TextAnswerPuzzle";

export class TextAnswerFactory implements IPuzzleFactory {
    createItem({ puzzle, focused, ...rest }: IPuzzleFactoryProps): React.ReactNode {
        return (
            <EditorContext.Consumer>
                {() => (
                    <TextAnswerPuzzle {...{ id: puzzle.id, questionFocused: focused }} {...rest} />
                )}
            </EditorContext.Consumer>
        );
    }
}
