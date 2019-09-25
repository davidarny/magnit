/** @jsx jsx */

import { jsx } from "@emotion/core";
import { EditorContext } from "context";
import * as React from "react";
import { useContext } from "react";
import { IPuzzleFactory, IPuzzleFactoryProps } from "services/item";
import { ReferenceAsset } from "./ReferenceAsset";

export class ReferenceAssetFactory implements IPuzzleFactory {
    create(props: IPuzzleFactoryProps): React.ReactNode {
        const context = useContext(EditorContext);
        const { onAddAnswerPuzzle, onDeleteAnswerPuzzle, ...rest } = context;

        const addAssetButton = !!props.parent && props.parent.puzzles.length === props.index;

        return (
            <ReferenceAsset
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
