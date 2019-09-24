/** @jsx jsx */

import { jsx } from "@emotion/core";
import { EditorContext } from "context";
import * as React from "react";
import { useContext } from "react";
import { IPuzzleFactory, IPuzzleFactoryProps } from "services/item";
import { RadioAnswer } from "./RadioAnswer";

export class RadioAnswerFactory implements IPuzzleFactory {
    create({ puzzle, focused, ...props }: IPuzzleFactoryProps): React.ReactNode {
        const context = useContext(EditorContext);
        const { onAddAnswerPuzzle, onDeleteAnswerPuzzle, ...rest } = context;

        const addRadioButton = !!props.parent && props.parent.puzzles.length - 1 === props.index;

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
