/** @jsx jsx */

import * as React from "react";
import { useContext } from "react";
import { jsx } from "@emotion/core";
import { IPuzzleFactory, IPuzzleFactoryProps } from "services/item";
import { EditorContext } from "TemplateEditor";
import { DropdownAnswer } from "./DropdownAnswer";

export class DropdownAnswerFactory implements IPuzzleFactory {
    create({ puzzle, focused, ...props }: IPuzzleFactoryProps): React.ReactNode {
        const context = useContext(EditorContext);
        const { onAddAnswerPuzzle, onDeleteAnswerPuzzle, ...rest } = context;

        const addDropdownButton =
            !!props.parentPuzzle && props.parentPuzzle.puzzles.length - 1 === props.index;

        return (
            <DropdownAnswer
                id={puzzle.id}
                title={puzzle.title}
                focused={focused}
                onAddDropdownButton={onAddAnswerPuzzle}
                onDeleteDropdownButton={onDeleteAnswerPuzzle}
                addDropdownButton={addDropdownButton}
                {...rest}
                {...props}
            />
        );
    }
}
