/** @jsx jsx */

import { jsx } from "@emotion/core";
import { EditorContext } from "context";
import * as React from "react";
import { useContext } from "react";
import { IPuzzleFactory, IPuzzleFactoryProps } from "services/item";
import { DropdownAnswer } from "./DropdownAnswer";

export class DropdownAnswerFactory implements IPuzzleFactory {
    create(props: IPuzzleFactoryProps): React.ReactNode {
        const context = useContext(EditorContext);
        const { onAddAnswerPuzzle, onDeleteAnswerPuzzle, ...rest } = context;

        const addDropdownButton = !!props.parent && props.parent.puzzles.length - 1 === props.index;

        return (
            <DropdownAnswer
                onAddDropdownButton={onAddAnswerPuzzle}
                onDeleteDropdownButton={onDeleteAnswerPuzzle}
                addDropdownButton={addDropdownButton}
                {...rest}
                {...props}
            />
        );
    }
}
