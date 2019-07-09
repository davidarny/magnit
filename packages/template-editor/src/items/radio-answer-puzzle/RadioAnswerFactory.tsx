/** @jsx jsx */

import * as React from "react";
import { useContext } from "react";
import { jsx } from "@emotion/core";
import { RadioAnswerPuzzle } from "./RadioAnswerPuzzle";
import { EditorContext } from "TemplateEditor";
import { IPuzzleFactory, IPuzzleFactoryProps } from "services/item";

export class RadioAnswerFactory implements IPuzzleFactory {
    create({ puzzle, focused, ...props }: IPuzzleFactoryProps): React.ReactNode {
        const context = useContext(EditorContext);
        const { onAddAnswerPuzzle, onDeleteAnswerPuzzle, ...rest } = context;

        const addRadioButton =
            !!props.parentPuzzle && props.parentPuzzle.puzzles.length - 1 === props.index;

        return (
            <RadioAnswerPuzzle
                {...props}
                {...rest}
                id={puzzle.id}
                title={puzzle.title}
                focused={focused}
                onAddRadioButton={onAddAnswerPuzzle}
                onDeleteRadioButton={onDeleteAnswerPuzzle}
                addRadioButton={addRadioButton}
            />
        );
    }
}
