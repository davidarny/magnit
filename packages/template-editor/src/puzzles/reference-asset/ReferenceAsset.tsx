/** @jsx jsx */

import { jsx } from "@emotion/core";
import { Fab } from "@magnit/components";
import { ETerminals, IFocusedPuzzleProps, IPuzzle } from "@magnit/entities";
import { AddIcon } from "@magnit/icons";
import { Grid, Typography } from "@material-ui/core";
import { Close as CloseIcon } from "@material-ui/icons";
import _ from "lodash";
import * as React from "react";
import { useCallback, useRef } from "react";

interface IReferenceAssetProps extends IFocusedPuzzleProps {
    title: string;
    description: string;
    // flag indication this asset should render
    // button which adds new asset when clicked
    addAssetButton: boolean;

    onUploadAsset(file: File): Promise<{ filename: string }>;

    onAddAsset(id: string, addition?: Partial<IPuzzle>): void;

    onDeleteAsset(filename: string): Promise<unknown>;

    onDeleteAssetPuzzle(id: string): void;
}

export const ReferenceAsset: React.FC<IReferenceAssetProps> = props => {
    const { focused, id, description, addAssetButton } = props;
    const { onUploadAsset, onAddAsset, onDeleteAsset, onDeleteAssetPuzzle } = props;

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
            onUploadAsset(file).then(response => {
                onAddAsset(id, {
                    title: _.get(file, "name", ETerminals.EMPTY),
                    description: response.filename,
                });
            });
        },
        [id, onUploadAsset, onAddAsset],
    );

    const onDeleteAssetCallback = useCallback(() => {
        const url = description;
        const filename = url.substring(url.lastIndexOf("/") + 1);
        onDeleteAsset(filename).then(() => onDeleteAssetPuzzle(id));
    }, [description, id, onDeleteAsset, onDeleteAssetPuzzle]);

    return (
        <Grid css={() => ({ ...(!focused ? { display: "none" } : {}) })} item xs={3}>
            <Grid
                container
                justify="center"
                alignItems="center"
                direction="column"
                css={theme => ({
                    height: "100%",
                    border: `1px solid ${theme.colors.lightGray}`,
                    borderRadius: theme.radius(0.5),
                    minHeight: theme.spacing(20),
                    position: "relative",
                })}
            >
                {!addAssetButton && (
                    <React.Fragment>
                        <img
                            css={theme => ({
                                width: "100%",
                                maxHeight: theme.spacing(20),
                            })}
                            alt={props.title}
                            src={props.description}
                        />
                        <div
                            onClick={onDeleteAssetCallback}
                            css={theme => ({
                                padding: theme.spacing(0.5),
                                borderRadius: "50%",
                                background: theme.colors.gray,
                                color: theme.colors.white,
                                position: "absolute",
                                top: "-12px", // TODO: dynamic calculation
                                right: "-12px", // TODO: dynamic calculation
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                cursor: "pointer",
                            })}
                        >
                            <CloseIcon css={theme => ({ fontSize: theme.fontSize.normal })} />
                        </div>
                    </React.Fragment>
                )}
                {addAssetButton && (
                    <React.Fragment>
                        <input
                            ref={input}
                            type="file"
                            accept="image/*"
                            hidden
                            onChange={onFileChangeCallback}
                        />
                        <Fab
                            css={theme => ({
                                width: theme.spacing(5),
                                height: theme.spacing(5),
                                marginBottom: theme.spacing(),
                            })}
                            onClick={onAddAssetTrigger}
                        >
                            <AddIcon />
                        </Fab>
                        <Typography
                            css={theme => ({
                                userSelect: "none",
                                fontSize: theme.fontSize.sNormal,
                                color: theme.colors.secondary,
                            })}
                            align="center"
                        >
                            Добавить фото
                        </Typography>
                    </React.Fragment>
                )}
            </Grid>
        </Grid>
    );
};
