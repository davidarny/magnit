/** @jsx jsx */

import { jsx } from "@emotion/core";
import { Grid } from "@material-ui/core";
import { Close as CloseIcon } from "@material-ui/icons";
import { FileOrIcon } from "file-or-icon";
import React from "react";

interface IAssetPreviewProps {
    src?: string;
    filename?: string;
    ext?: string;
    deletable?: boolean;
    add?: boolean;

    render?(): React.ReactNode;

    onDelete?(): void;
}

export const AssetPreview: React.FC<IAssetPreviewProps> = props => {
    const { src = "", filename = "", ext, deletable = false, onDelete, render, ...rest } = props;

    return (
        <Grid
            title={filename}
            container
            justify="center"
            alignItems="center"
            direction="row"
            css={theme => ({
                border: `1px solid ${theme.colors.lightGray}`,
                borderRadius: theme.radius(0.5),
                minHeight: theme.spacing(20),
                position: "relative",
            })}
            {...rest}
        >
            {render && render()}
            {!render && (
                <React.Fragment>
                    <FileOrIcon src={src} filename={filename} ext={ext} />
                    {deletable && (
                        <div
                            onClick={onDelete}
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
                    )}
                </React.Fragment>
            )}
        </Grid>
    );
};

AssetPreview.displayName = "AssetPreview";
