/** @jsx jsx */

import { jsx } from "@emotion/core";
import { AssetPreview } from "@magnit/components";
import { Grid } from "@material-ui/core";
import _ from "lodash";
import React from "react";
import { IPuzzleProps } from "services/item";

export const UploadFiles: React.FC<IPuzzleProps> = props => {
    const { answer } = props;

    if (!answer) {
        return null;
    }

    const splitted = answer.answer.split("?originalname=");
    const src = _.first(splitted)!;
    const filename = _.last(splitted)!;
    const ext = src.split(".").pop();

    return (
        <Grid item xs={2}>
            <AssetPreview filename={filename} src={src} ext={ext} />
        </Grid>
    );
};

UploadFiles.displayName = "UploadFiles";
