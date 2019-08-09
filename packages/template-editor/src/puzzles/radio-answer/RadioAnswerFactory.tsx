/** @jsx jsx */

import * as React from "react";
import { useContext } from "react";
import { jsx } from "@emotion/core";
import { RadioAnswer } from "./RadioAnswer";
import { EditorContext } from "context";
import { IPuzzleFactory, IPuzzleFactoryProps } from "services/item";

export class RadioAnswerFactory implements IPuzzleFactory {
    create({ puzzle, focused, ...props }: IPuzzleFactoryProps): React.ReactNode {
        const context = useContext(EditorContext);
        const { onAddAnswerPuzzle, onDeleteAnswerPuzzle, ...rest } = context;

        const addRadioButton =
            !!props.parentPuzzle && props.parentPuzzle.puzzles.length - 1 === props.index;

        return (
            <RadioAnswer
                id={puzzle.id}
                title={puzzle.title}
                focused={focused}
                onAddRadioButton={onAddAnswerPuzzle}
                onDeleteRadioButton={onDeleteAnswerPuzzle}
                addRadioButton={addRadioButton}
                {...rest}
                {...props}
            />
        );
    }
}
