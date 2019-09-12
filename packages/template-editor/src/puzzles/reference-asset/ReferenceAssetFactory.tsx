/** @jsx jsx */

import { jsx } from "@emotion/core";
import { EditorContext } from "context";
import * as React from "react";
import { useContext } from "react";
import { IPuzzleFactory, IPuzzleFactoryProps } from "services/item";
import { ReferenceAsset } from "./ReferenceAsset";

export class ReferenceAssetFactory implements IPuzzleFactory {
    create({ puzzle, focused, ...props }: IPuzzleFactoryProps): React.ReactNode {
        const context = useContext(EditorContext);
        const { onAddAnswerPuzzle, onDeleteAnswerPuzzle, ...rest } = context;

        const addAssetButton =
            !!props.parentPuzzle && props.parentPuzzle.puzzles.length === props.index;

        return (
            <ReferenceAsset
                title={puzzle.title}
                description={puzzle.description}
                id={puzzle.id}
                focused={focused}
                addAssetButton={addAssetButton}
                onAddAsset={onAddAnswerPuzzle}
                onDeleteAssetPuzzle={onDeleteAnswerPuzzle}
                onUploadAsset={context.onUploadAsset}
                onDeleteAsset={context.onDeleteAsset}
                {...rest}
                {...props}
            />
        );
    }
}
