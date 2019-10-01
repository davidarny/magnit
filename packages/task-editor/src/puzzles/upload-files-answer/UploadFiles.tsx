/** @jsx jsx */

import { jsx } from "@emotion/core";
import { Grid } from "@material-ui/core";
import React from "react";
import { IPuzzleProps } from "services/item";

export const UploadFiles: React.FC<IPuzzleProps> = props => {
    const { answer } = props;

    if (!answer) {
        return null;
    }

    return (
        <Grid item xs={2}>
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
                <img
                    css={theme => ({
                        width: "100%",
                        objectFit: "contain",
                        maxHeight: theme.spacing(20),
                    })}
                    alt={answer.answer}
                    src={answer.answer}
                />
            </Grid>
        </Grid>
    );
};
