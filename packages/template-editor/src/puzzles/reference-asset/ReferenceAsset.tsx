/** @jsx jsx */

import { jsx } from "@emotion/core";
import { AssetPreview, Fab } from "@magnit/components";
import { EPuzzleType, IFocusedPuzzleProps, IPuzzle } from "@magnit/entities";
import { AddIcon } from "@magnit/icons";
import { Grid, Typography } from "@material-ui/core";
import _ from "lodash";
import * as React from "react";
import { useCallback, useRef } from "react";

interface IReferenceAssetProps extends IFocusedPuzzleProps {
    // flag indication this asset should render
    // button which adds new asset when clicked
    addAssetButton: boolean;

    onUploadAsset(file: File): Promise<{ filename: string }>;

    onAddAsset(id: string, addition?: Partial<IPuzzle>): void;

    onDeleteAsset(filename: string): Promise<unknown>;

    onDeleteAssetPuzzle(id: string): void;
}

export const ReferenceAsset: React.FC<IReferenceAssetProps> = props => {
    const {
        puzzle,
        focused,
        addAssetButton,
        onUploadAsset,
        onAddAsset,
        onDeleteAsset,
        onDeleteAssetPuzzle,
    } = props;

    const input = useRef<HTMLInputElement>(null);

    function onAddAssetTrigger() {
        if (input.current) {
            input.current.click();
        }
    }

    const onFileChangeCallback = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = _.first(event.target.files);
            if (!file) {
                return;
            }
            onUploadAsset(file)
                .then(response => {
                    onAddAsset(puzzle.id, {
                        puzzleType: EPuzzleType.REFERENCE_ASSET,
                        title: _.get(file, "name", ""),
                        description: response.filename,
                    });
                })
                .catch(console.error);
        },
        [puzzle.id, onUploadAsset, onAddAsset],
    );

    const onDeleteAssetCallback = useCallback(() => {
        const url = puzzle.description;
        const filename = url.substring(url.lastIndexOf("/") + 1);
        onDeleteAsset(filename)
            .catch(console.error)
            .finally(() => onDeleteAssetPuzzle(puzzle.id));
    }, [puzzle.description, puzzle.id, onDeleteAsset, onDeleteAssetPuzzle]);

    return (
        <Grid css={() => ({ ...(!focused ? { display: "none" } : {}) })} item xs={2}>
            {!addAssetButton && (
                <AssetPreview
                    deletable
                    src={puzzle.description}
                    filename={puzzle.title}
                    ext={puzzle.description.split(".").pop()}
                    onDelete={onDeleteAssetCallback}
                />
            )}
            {addAssetButton && (
                <AssetPreview
                    css={{ flexDirection: "column" }}
                    render={() => (
                        <React.Fragment>
                            <Grid item xs={12}>
                                <input
                                    ref={input}
                                    accept="image/*,.pdf,.doc,.xls,.xlsx"
                                    type="file"
                                    hidden
                                    onChange={onFileChangeCallback}
                                />
                                <Fab
                                    css={theme => ({
                                        width: theme.spacing(4),
                                        height: theme.spacing(4),
                                        minHeight: theme.spacing(4),
                                        marginBottom: theme.spacing(),
                                    })}
                                    onClick={onAddAssetTrigger}
                                >
                                    <AddIcon />
                                </Fab>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography
                                    css={theme => ({
                                        userSelect: "none",
                                        fontSize: theme.fontSize.sNormal,
                                        color: theme.colors.secondary,
                                    })}
                                    align="center"
                                >
                                    Добавить файл
                                </Typography>
                            </Grid>
                        </React.Fragment>
                    )}
                />
            )}
        </Grid>
    );
};
