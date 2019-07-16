/** @jsx jsx */

import * as React from "react";
import { jsx } from "@emotion/core";
import { IPuzzleFactory, IPuzzleFactoryProps } from "services/item";
import { EditorContext } from "TemplateEditor";
import { CheckboxAnswer } from "./CheckboxAnswer";
import { useContext } from "react";

export class CheckboxAnswerFactory implements IPuzzleFactory {
    create({ puzzle, focused, ...props }: IPuzzleFactoryProps): React.ReactNode {
        const context = useContext(EditorContext);
        const { onAddAnswerPuzzle, onDeleteAnswerPuzzle, ...rest } = context;

        const addCheckboxButton =
            !!props.parentPuzzle && props.parentPuzzle.puzzles.length - 1 === props.index;

        return (
            <CheckboxAnswer
                {...rest}
                {...props}
                id={puzzle.id}
                title={puzzle.title}
                focused={focused}
                onAddCheckboxButton={onAddAnswerPuzzle}
                onDeleteCheckboxButton={onDeleteAnswerPuzzle}
                addCheckboxButton={addCheckboxButton}
            />
        );
    }
}
